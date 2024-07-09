import {
  forwardRef,
  type ForwardedRef,
  useImperativeHandle,
  useRef,
} from 'react';
import WebView, {
  type WebViewProps,
  type WebViewMessageEvent,
} from 'react-native-webview';
import { TossPaymentsV2WidgetHtml } from '../html/TossPaymentsV2WidgetHtml';
import type { StyleProp, ViewStyle } from 'react-native';
import { useStableCallback } from '../util/useStableCallback';
import { is } from '@mj-studio/js-util';

/**
 * https://docs.tosspayments.com/sdk/v2/js#widgetsrequestpayment
 */

type TossPaymentsV2WidgetProps = {
  style?: StyleProp<ViewStyle>;
  webViewProps?: Omit<
    WebViewProps,
    'source' | 'onShouldStartLoadWithRequest' | 'onMessage'
  >;
  clientKey: string;
  customerKey: 'ANONYMOUS' | (string & {});
  paymentRequest: TossPaymentsV2WidgetPaymentRequest;
  onPaymentSuccess: (
    response: TossPaymentsV2WidgetPaymentSuccessResponse
  ) => void;
  onPaymentFail: (response: TossPaymentsV2WidgetPaymentFailResponse) => void;
  onPaymentError?: (e: any) => void;
};
type TossPaymentsV2WidgetRef = {};
type WebViewMessageType = 'init' | 'setParam' | 'requestPayment';
type WebViewOnMessageType = 'requestPaymentFail' | 'unknownError';
type TossPaymentsV2WidgetPaymentSuccessResponse = {
  paymentType: string;
  orderId: string;
  paymentKey: string;
  amount: number;
};
type TossPaymentsV2WidgetPaymentFailResponse = {
  code: string;
  message: string;
  orderId: string;
};
type TossPaymentsV2WidgetPaymentRequest = {
  amount: number;
  orderId: string;
  orderName: string;
  customerEmail?: string;
  customerName?: string;
  customerMobilePhone?: string;
  taxFreeAmount?: number;
  card?: { taxExemptionAmount?: number };
};

const TossPaymentsV2Widget = forwardRef(
  (
    {
      style,
      webViewProps,
      clientKey,
      customerKey,
      onPaymentFail,
      onPaymentSuccess,
      paymentRequest,
      onPaymentError,
    }: TossPaymentsV2WidgetProps,
    ref: ForwardedRef<TossPaymentsV2WidgetRef>
  ) => {
    const inner = useRef<WebView>(null);

    const postMessage = ({
      type,
      data,
    }: {
      type: WebViewMessageType;
      data?: any;
    }) => {
      inner.current?.injectJavaScript(
        `(function(){
          window.dispatchEvent(new MessageEvent('message', {data : ${JSON.stringify({ type, data })}}))
      })()`
      );
    };

    const setParams = useStableCallback((key: string, value?: any) => {
      postMessage({ type: 'setParam', data: { key, value } });
    });

    const init = useStableCallback(() => {
      postMessage({ type: 'init' });
    });

    const onLoadWebView = useStableCallback(() => {
      setParams('clientKey', clientKey);
      setParams('customerKey', customerKey);
      const {
        amount,
        orderId,
        orderName,
        customerEmail,
        customerName,
        customerMobilePhone,
        card,
        taxFreeAmount,
      } = paymentRequest;
      setParams('amount', amount);
      setParams('orderId', orderId);
      setParams('orderName', orderName);
      setParams('customerEmail', customerEmail);
      setParams('customerName', customerName);
      setParams('customerMobilePhone', customerMobilePhone);
      setParams('card', card);
      setParams('taxFreeAmount', taxFreeAmount);
      init();
    });

    const onMessage = useStableCallback((event: WebViewMessageEvent) => {
      const rawData = event?.nativeEvent?.data;
      if (
        is.notEmptyString(rawData) &&
        rawData.startsWith('{') &&
        rawData.endsWith('}')
      ) {
        const { type, data }: { type: WebViewOnMessageType; data?: any } =
          JSON.parse(rawData);
        if (type === 'requestPaymentFail') {
          onPaymentError?.(data);
        }
      }
    });

    useImperativeHandle(ref, () => ({}), []);

    return (
      <WebView
        ref={inner}
        {...webViewProps}
        onLoad={(e) => {
          webViewProps?.onLoad?.(e);
          onLoadWebView();
        }}
        style={[style, webViewProps?.style]}
        source={{ html: TossPaymentsV2WidgetHtml }}
        onMessage={onMessage}
        onShouldStartLoadWithRequest={({ url }) => {
          if (url.startsWith('https://success')) {
            const params = new URL(url).searchParams;
            const paymentType = params.get('paymentType') || '';
            const orderId = params.get('orderId') || '';
            const paymentKey = params.get('paymentKey') || '';
            const amount = Number(params.get('amount'));
            onPaymentSuccess({
              amount,
              orderId,
              paymentKey,
              paymentType,
            });

            return false;
          } else if (url.startsWith('https://fail')) {
            const params = new URL(url).searchParams;
            const code = params.get('code') || '';
            const message = params.get('message') || '';
            const orderId = params.get('orderId') || '';
            onPaymentFail({
              code,
              message,
              orderId,
            });

            return false;
          }
          return true;
        }}
      />
    );
  }
);

export { TossPaymentsV2Widget };
export type {
  TossPaymentsV2WidgetProps,
  TossPaymentsV2WidgetRef,
  TossPaymentsV2WidgetPaymentSuccessResponse,
  TossPaymentsV2WidgetPaymentFailResponse,
  TossPaymentsV2WidgetPaymentRequest,
};

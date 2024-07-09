import {
  forwardRef,
  type ForwardedRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react';
import WebView, { type WebViewProps } from 'react-native-webview';
import { TossPaymentsV2WidgetHtml } from '../html/TossPaymentsV2WidgetHtml';
import type { StyleProp, ViewStyle } from 'react-native';
import { useStableCallback } from '../util/useStableCallback';

type TossPaymentsV2WidgetProps = {
  style?: StyleProp<ViewStyle>;
  webViewProps?: Omit<WebViewProps, 'source'>;
  clientKey: string;
  customerKey: 'ANONYMOUS' | (string & {});
};
type TossPaymentsV2WidgetRef = {};
const TossPaymentsV2Widget = forwardRef(
  (
    { style, webViewProps, clientKey, customerKey }: TossPaymentsV2WidgetProps,
    ref: ForwardedRef<TossPaymentsV2WidgetRef>
  ) => {
    const inner = useRef<WebView>(null);
    useImperativeHandle(ref, () => ({}), []);

    const injectJs = useStableCallback((js: string) => {
      inner.current?.injectJavaScript(`(function(){${js};return true;})()`);
    });

    const setParams = useStableCallback((key: string, value: string) => {
      injectJs(`setParam('${key}', '${value}')`);
    });

    const init = useStableCallback(() => {
      injectJs(`init()`);
    });

    const onLoadWebView = useStableCallback(() => {
      setParams('clientKey', clientKey);
      setParams('customerKey', customerKey);
      init();
    });

    useEffect(() => {
      setTimeout(() => {
        init();
      }, 1000);
    }, [init]);

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
      />
    );
  }
);

export { TossPaymentsV2Widget };
export type { TossPaymentsV2WidgetProps, TossPaymentsV2WidgetRef };

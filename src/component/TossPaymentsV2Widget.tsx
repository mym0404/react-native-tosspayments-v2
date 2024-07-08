import { forwardRef, type ForwardedRef, useImperativeHandle } from 'react';
import WebView, { type WebViewProps } from 'react-native-webview';
import { TossPaymentsV2WidgetHtml } from '../html/TossPaymentsV2WidgetHtml';
import type { StyleProp, ViewStyle } from 'react-native';

type TossPaymentsV2WidgetProps = {
  style?: StyleProp<ViewStyle>;
  webViewProps?: Omit<WebViewProps, 'source'>;
};
type TossPaymentsV2WidgetRef = {};
const TossPaymentsV2Widget = forwardRef(
  (
    { style, webViewProps }: TossPaymentsV2WidgetProps,
    ref: ForwardedRef<TossPaymentsV2WidgetRef>
  ) => {
    useImperativeHandle(ref, () => ({}), []);

    return (
      <WebView
        {...webViewProps}
        style={[style, webViewProps?.style]}
        source={{ html: TossPaymentsV2WidgetHtml }}
      />
    );
  }
);

export { TossPaymentsV2Widget };
export type { TossPaymentsV2WidgetProps, TossPaymentsV2WidgetRef };

export const TossPaymentsV2WidgetHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      name="viewport"
      charset="UTF-8"
    />
    <title>Toss Payments V2 Widget</title>
    <script src="https://js.tosspayments.com/v2/standard"></script>
    <style></style>
  </head>
  <body>
    <!-- 결제 UI -->
    <div id="payment-method"></div>
    <!-- 이용약관 UI -->
    <div id="agreement"></div>
    <!-- 결제하기 버튼 -->
    <button class="button" id="payment-button" style="margin-top: 30px">
      결제하기
    </button>

    <script>
      const UNKNOWN_ERROR = {
        code: 'UNKNOWN',
        message: '알 수 없는 에러가 발생했습니다.',
      };
      const PARAMS = {};

      function sendMessageToRN(type, data) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type, data }));
      }

      function setParam(key, value) {
        PARAMS[key] = value;
      }

      async function requestPayment(widgets) {
        try {
          await widgets.requestPayment({
            successUrl: 'https://success',
            failUrl: 'https://fail',
            orderId: PARAMS['orderId'],
            orderName: PARAMS['orderName'],
            customerEmail: PARAMS['customerEmail'],
            customerName: PARAMS['customerName'],
            customerMobilePhone: PARAMS['customerMobilePhone'],
            taxFreeAmount: PARAMS['taxFreeAmount'],
            card: PARAMS['card']
              ? { taxExemptionAmount: PARAMS['card'].taxExemptionAmount }
              : undefined,
          });
        } catch (e) {
          sendMessageToRN(
            'requestPaymentFail',
            typeof e === 'object' && e
              ? {
                  code: e.code,
                  message: e.message,
                }
              : UNKNOWN_ERROR
          );
        }
      }

      async function init() {
        const button = document.getElementById('payment-button');
        // ------  결제위젯 초기화 ------
        const clientKey = PARAMS['clientKey'];
        const tossPayments = TossPayments(clientKey);

        // 회원 결제 or 비회원 결제
        const customerKey = PARAMS['customerKey'];
        const widgets = tossPayments.widgets({
          customerKey: customerKey || TossPayments.ANONYMOUS,
        });

        // ------ 주문의 결제 금액 설정 ------
        await widgets.setAmount({
          currency: 'KRW',
          value: PARAMS['amount'],
        });

        // ------  결제 UI 렌더링 ------
        await widgets.renderPaymentMethods({
          selector: '#payment-method',
          variantKey: 'DEFAULT',
        });

        // ------  이용약관 UI 렌더링 ------
        await widgets.renderAgreement({
          selector: '#agreement',
          variantKey: 'AGREEMENT',
        });

        // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
        button.addEventListener('click', function () {
          requestPayment(widgets);
        });
      }

      async function handleMessage({ type, data }) {
        try {
          if (type === 'init') {
            await init();
          } else if (type === 'setParam') {
            setParam(data.key, data.value);
          }
        } catch (e) {
          sendMessageToRN(
            'unknownError',
            typeof e === 'object' && e
              ? {
                  code: e.code,
                  message: e.message,
                }
              : UNKNOWN_ERROR
          );
        }
      }

      document.addEventListener('message', (event) => {
        handleMessage(event.data);
      });

      window.addEventListener('message', (event) => {
        handleMessage(event.data);
      });
    </script>
  </body>
</html>
`;
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { TossPaymentsV2Widget } from 'react-native-tosspayments-v2';

function Home() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TossPaymentsV2Widget
        clientKey={'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'}
        customerKey={'ANONYMOUS'}
        style={{ borderWidth: 1 }}
        webViewProps={{}}
        onPaymentSuccess={(response) => {
          console.log(`SUCCESS, ${JSON.stringify(response)}`);
        }}
        onPaymentFail={(response) => {
          console.log(`FAIL, ${JSON.stringify(response)}`);
        }}
        paymentRequest={{
          amount: 1000,
          orderId: 'asfasfasfwg2e2ec2ecaws',
          orderName: 'order name',
          card: { taxExemptionAmount: 123 },
        }}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Home />
    </SafeAreaProvider>
  );
}

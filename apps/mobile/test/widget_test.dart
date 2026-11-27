import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/main.dart';

void main() {
  testWidgets('mobile app launches with its scaffold title', (tester) async {
    await tester.pumpWidget(const AutonomyMobileApp());

    expect(find.text('Autonomy Insurance'), findsOneWidget);
  });
}

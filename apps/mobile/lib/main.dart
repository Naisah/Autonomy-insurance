import 'package:flutter/material.dart';

import 'app/routes.dart';

void main() {
  runApp(const AutonomyMobileApp());
}

class AutonomyMobileApp extends StatelessWidget {
  const AutonomyMobileApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Autonomy Insurance',
      routes: MobileRoutes.routes,
      home: const Scaffold(
        body: Center(child: Text('Autonomy Insurance')),
      ),
    );
  }
}

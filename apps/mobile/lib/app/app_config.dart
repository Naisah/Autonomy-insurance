/// Runtime endpoints for local emulator development and hosted builds.
class AppConfig {
  AppConfig._();

  static const authBaseUrl = String.fromEnvironment(
    'AUTH_BASE_URL',
    defaultValue: 'http://10.0.2.2:4001',
  );

  static const coreApiBaseUrl = String.fromEnvironment(
    'CORE_API_BASE_URL',
    defaultValue: 'http://10.0.2.2:4002',
  );
}

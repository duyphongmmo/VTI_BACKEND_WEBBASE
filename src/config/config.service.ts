import { registerAs } from '@nestjs/config';
export const GlobalConfig = registerAs('global', () => ({
  tcpServers: {
    userService: {
      port: Number(process.env.USER_SERVICE_PORT) || 3000,
      host: process.env.USER_SERVICE_HOST || 'user-service',
    },
  },
}));
export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {
      port: process.env.PORT,
      httpPort: process.env.PORT,
      otpMinNumber: parseInt(process.env.OTP_MIN_NUMBER),
      otpMaxNumber: parseInt(process.env.OTP_MAX_NUMBER),
      otpTimeout: parseInt(process.env.OTP_TIME_OUT),
      saltOrRounds: parseInt(process.env.SALT_OR_ROUNDS),
    };
    this.envConfig.baseUri = process.env.BASE_URI;
    this.envConfig.gatewayPort = process.env.API_GATEWAY_PORT;
    this.envConfig.licenseToken = process.env.LICENSE_TOKEN || '05082022001';
    this.envConfig.constractNumber =
      process.env.CONSTRACT_NUMBER || '43/HĐ-GENCO3/22';
    this.envConfig.INTERNAL_TOKEN =
      process.env.INTERNAL_TOKEN ||
      't5AQ1il1FtOk6Pp9FEW0VbwYETYqqseisgvo0ZCchayvvsQYFSkNzP7bNZ7vEFr0B1Hd4Ft3KGls1q2Irc20Yv1juslgTgtP4lavfeFiw7qBDDzw5D5Y7vMxoIfkpEqcViZqcPy3K2TCOqzCVGAQjJ4bvmX01xeCqILT5ewBd7fL3hZ4jBlSYmbiIefVIiRzeFhWCYOuVpS4Ng4lPcEBvUorm5zlLAci65UKdKtoXbPtWp2A1jrE5D';

    this.envConfig.factoryId = process.env.FACTORY_ID || 1;
    this.envConfig.tax = process.env.TAX || 8;

    this.envConfig.oracle = {
      host: process.env.ORACLE_HOST || 'localhost',
      port: process.env.ORACLE_PORT || 1521,
      username: process.env.ORACLE_USERNAME || 'system',
      password: process.env.ORACLE_PASSWORD || 'oracle',
      serviceName: 'sc1vina',
      logging: process.env.ORACLE_LOGGING || false,
      instantClientDir:  process.env.ORACLE_CLIENT_DIR || ''
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}

export class ServerConfig {
    public static readonly port: number = process.env.PORT || 5000;
    public static readonly isHttps: boolean = false;
}

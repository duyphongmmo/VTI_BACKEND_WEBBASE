### **Giới thiệu tổng quan về NestJS cho người mới bắt đầu**

Chào mừng bạn đến với NestJS! Đây là tài liệu giúp bạn có cái nhìn tổng quan và bắt đầu làm quen với một trong những framework Node.js mạnh mẽ và hiện đại nhất hiện nay.

#### **1. NestJS là gì?**

NestJS là một framework dùng để xây dựng các ứngdụng phía máy chủ (backend) hiệu quả, đáng tin cậy và có khả năng mở rộng. Nó được xây dựng trên nền tảng của **Node.js** và sử dụng **TypeScript**, một phiên bản nâng cao của JavaScript giúp mã nguồn trở nên chặt chẽ và dễ bảo trì hơn.

NestJS cung cấp một kiến trúc ứng dụng rõ ràng, được lấy cảm hứng từ Angular, giúp bạn dễ dàng tổ chức code và phát triển các ứng dụng phức tạp.

#### **2. Tại sao nên chọn NestJS? Triết lý thiết kế**

NestJS được tạo ra để giải quyết vấn đề về "kiến trúc" trong thế giới Node.js. Trong khi Node.js rất mạnh mẽ, nó không đưa ra một quy chuẩn chung về cách tổ chức dự án. Điều này có thể dẫn đến code khó bảo trì khi dự án lớn dần.

NestJS giải quyết vấn đề này bằng cách cung cấp một bộ khung (architecture) có sẵn, kết hợp các ý tưởng tốt nhất từ Lập trình hướng đối tượng (OOP), Lập trình hàm (FP) và Lập trình hàm phản ứng (FRP).

- **Sử dụng TypeScript:** Giúp phát hiện lỗi ngay trong quá trình code, tăng tính ổn định và dễ dàng tái cấu trúc code.
- **Kiến trúc rõ ràng:** Cung cấp cấu trúc ứng dụng hoàn chỉnh ngay từ đầu, giúp các nhà phát triển dễ dàng tạo ra các ứng dụng có tính module cao, dễ kiểm thử (test) và dễ bảo trì.
- **Mở rộng linh hoạt:** Mặc dù cung cấp một cấu trúc chặt chẽ, NestJS vẫn rất linh hoạt. Nó sử dụng các framework HTTP phổ biến như **Express** (mặc định) hoặc **Fastify**, cho phép bạn tận dụng hệ sinh thái rộng lớn của chúng.

#### **3. Các thành phần cốt lõi trong NestJS**

Khi làm việc với NestJS, bạn sẽ thường xuyên gặp các khái niệm sau:

**3.1 Controllers:**

## 1. Controller là gì?

    Controller trong NestJS chịu trách nhiệm **nhận request từ client** và **trả response** về. Nó đóng vai trò giống như _router_ trong Express/Fastify nhưng được tổ chức theo **class + decorator**.

    Luồng xử lý chuẩn:

    Request → Middleware → Guard → Interceptor (before) → Pipe → Controller → Service → Interceptor (after) → Exception Filter (nếu có lỗi) → Response
    ---

## 2. Khai báo Controller cơ bản

    ```ts
    import { Controller, Get } from "@nestjs/common";

    @Controller("items")
    export class ItemController {
    @Get()
    findAll() {
        return "List items";
    }
    }
    ```

## 3. HTTP Method Decorators

| Decorator   | HTTP Method |
| ----------- | ----------- |
| `@Get()`    | GET         |
| `@Post()`   | POST        |
| `@Put()`    | PUT         |
| `@Patch()`  | PATCH       |
| `@Delete()` | DELETE      |
| `@All()`    | ALL         |

## 4. Route Parameters

### 4.1 @Param

```ts
@Get(':id')
findOne(@Param('id') id: number) {}
```

### 4.2 @Query

```ts
@Get()
find(@Query('page') page: number) {}
```

### 4.3 @Body

```ts
@Post()
create(@Body() dto: CreateItemDto) {}
```

### 4.4 @Headers / @Ip / @Req / @Res

## 5. Controller & DTO

DTO (Data Transfer Object) dùng để:
• Định nghĩa cấu trúc dữ liệu nhận vào / trả ra
• Validate dữ liệu request
• Tách biệt request layer và business logic

    ```ts
    import { IsString, IsInt, IsOptional, Min } from 'class-validator';

    export class CreateItemDto {
    @IsString()
    code: string;

    @IsString()
    name: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    price?: number;
    }
    ```

• Để sử dụng được DTO để validate cần phải bật ValidationPipe
• DTO chỉ chứa validation + shape data (Không xử lý logic trong DTO)

## 6. Những lưu ý QUAN TRỌNG khi viết Controller

    - Controller phải “mỏng” (thin controller) - đơn giản
    - Không try/catch tràn lan trong controller (Throw exception từ service)
    - Luôn validate Param / Query
    - Không trả entity trực tiếp nếu có dữ liệu nhạy cảm (Dùng Response DTO hoặc class-transformer)
    - Controller chỉ routing + gọi service

**3.2 Provider:**

## 1. Provider là gì?

    - Provider là một khái niệm cốt lõi trong Nest. Nhiều lớp cơ bản của Nest, chẳng hạn như service, repository, factory và helper, đều có thể được xem là provider. Ý tưởng chính của provider là chúng có thể được inject như một dependency (DI), cho phép các đối tượng hình thành nhiều mối quan hệ khác nhau với nhau

## 2. Service chính là Provider (phổ biến nhất)

    ```ts - item.service.ts
    @Injectable()
    export class ItemService {
    findAll() {
        return [];
    }
    }
    ```

    ```ts - item.module.ts
    @Module({
    providers: [ItemService],
    exports: [ItemService],
    })
    export class ItemModule {}
    ```

## 3. Dependency Injection (DI) hoạt động thế nào?

    ```ts - item.controller.ts
    @Controller('items')
    export class ItemController {
        constructor(private readonly itemService: ItemService) {}
    }

    NestJS:
    1.	Tạo instance ItemService
    2.	Lưu vào IoC container
    3.	Inject vào Controller
    ```

## 4. Các loại Provider trong NestJS

### 4.1 Class Provider (phổ biến)

    ```ts
    providers: [ItemService]

    Tương đương:

    {
    provide: ItemService,
    useClass: ItemService,
    }

    ```

### 4.2 Value Provider (constant, config)

    ```ts
    {
    provide: 'REDIS_HOST',
    useValue: 'localhost',
    }

    @Inject('REDIS_HOST')
    private readonly redisHost: string;

    ```

### 4.3 Factory Provider (logic khởi tạo)

    ```ts
    {
    provide: 'KAFKA_CLIENT',
    useFactory: (config: ConfigService) => {
        return new Kafka({
        clientId: config.get('KAFKA_CLIENT_ID'),
        });
    },
    inject: [ConfigService],
    }

    ✔ Tạo object phức tạp
    ✔ Có thể async

    ```

## 5. Token trong Provider

    Provider được định danh bằng token:
    •	Class
    •	string
    •	symbol

## 6. Những lưu ý

    - Provider chỉ sống trong module của nó
    - Phải export nếu module khác cần dùng
    - Global Provider (@Global(),
    Chỉ dùng cho infra chung:
    •	Logger
    •	Config
    •	Cache)

**3.3 Module:**

## 1. Module trong NestJS là gì?

Module là:
• Đơn vị tổ chức & đóng gói (encapsulation) code
• Gom các thành phần liên quan:
Controller – Provider – Service – Repository
• Là ranh giới phạm vi (scope) của provider

👉 Hiểu đơn giản:
Module = một “feature” hoặc “khối chức năng” của hệ thống

## 2. Cấu trúc cơ bản của Module

    ```ts
    @Module({
    imports: [],
    controllers: [],
    providers: [],
    exports: [],
    })
    export class ItemModule {}

    // - imports: Module khác mà module này cần
    // - controllers: Xử lý request
    // - providers: Service, repository, helper
    // - exports: Provider cho module khác dùng

    ```

**3.4 Others:**

- Middleware, Guard, Pipe, Interceptor, Exception Filter, Custom Decorator

## 1. Middleware

### Khái niệm

Middleware là hàm chạy **trước NestJS context**, làm việc trực tiếp với `req`, `res`, `next`.
Gần với Express/Fastify middleware.

### Dùng khi

- Logging request
- Gắn metadata vào request
- Parse header
- Legacy Express/Fastify logic

### Không nên dùng

- Authentication
- Authorization
- Validation

### Ví dụ

```ts
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${req.method}] ${req.url}`);
    next();
  }
}
```

```ts
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
```

---

## 2. Guard

### Khái niệm

Guard quyết định **request có được xử lý hay không**.
Trả về `true | false`.

### Dùng khi

- Authentication
- Authorization
- Role / Permission
- Feature flag

### Ví dụ Auth Guard

```ts
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    return !!req.user;
  }
}
```

```ts
@UseGuards(AuthGuard)
@Get('profile')
getProfile() {}
```

---

## 3. Pipe

### Khái niệm

Pipe xử lý **dữ liệu đầu vào**:

- Transform
- Validate

### Dùng khi

- Validate DTO
- Parse param
- Normalize input

### Ví dụ ParseIntPipe

```ts
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {}
```

### Ví dụ Validation DTO

```ts
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsInt()
  age: number;
}
```

```ts
@Post()
create(@Body() dto: CreateUserDto) {}
```

---

## 4. Interceptor

### Khái niệm

Interceptor bao quanh execution của handler, can thiệp **trước và sau** controller.

### Dùng khi

- Logging time
- Wrap response
- Cache
- Transaction

### Ví dụ Logging time

```ts
@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler) {
    const start = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log("Time:", Date.now() - start)));
  }
}
```

---

## 5. Exception Filter

### Khái niệm

Exception Filter bắt exception được throw ra và chuẩn hóa error response.

### Dùng khi

- Global error handler
- Format lỗi thống nhất
- Mapping DB error → HTTP error

### Ví dụ

```ts
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    res.status(500).json({
      message: exception.message,
    });
  }
}
```

```ts
app.useGlobalFilters(new AllExceptionFilter());
```

---

## 6. Custom Decorator

### Khái niệm

Custom Decorator là **syntax sugar**, giúp controller gọn hơn.
Không chứa business logic.

### Ví dụ CurrentUser

```ts
export const CurrentUser = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  }
);
```

```ts
@Get('profile')
getProfile(@CurrentUser() user) {}
```

### Decorator + Guard

```ts
@Roles('admin')
@UseGuards(RolesGuard)
```

---

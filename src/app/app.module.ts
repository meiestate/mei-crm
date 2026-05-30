import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';

@Module({
  imports: [
    /**
     * Global environment configuration
     * .env values எல்லா modules-லும் பயன்படுத்தலாம்
     */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    /**
     * Core Business Modules
     */
    AuthModule,
    UsersModule,
    WorkspacesModule,
  ],
})
export class AppModule {}
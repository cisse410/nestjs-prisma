import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { add } from 'date-fns';
import { DatabaseService } from 'src/database/database.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, first_name, last_name, bio, phone_number } =
      registerDto;

    //   Ici on verifie d'abord si l'utilisateur existe deja
    const existingUser = await this.databaseService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(`Un utilisateur avec ce mail existe deja`);
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // creer l'utilisateur
    const user = await this.databaseService.user.create({
      data: {
        email,
        password: hashedPassword,
        first_name,
        last_name,
        bio,
        phone_number,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        createdAt: true,
      },
    });

    // Générer les tokens
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user,
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // On cherche l'utilisateur avec son email
    const user = await this.databaseService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException(`Identifiants invalides`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(`Identifiants invalides`);
    }

    // Générer les tokens
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        bio: user.bio,
        phone_number: user.phone_number,
      },
      ...tokens,
    };
  }

  async validateUser(userId: number) {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        bio: true,
        phone_number: true,
        createdAt: true,
      },
    });

    return user;
  }

  private async generateTokens(userId: number, email: string) {
    // Générer l'access token
    const accessToken = this.jwtService.sign(
      { sub: userId, email },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '3h',
      },
    );

    // Générer le refresh token
    const refreshToken = this.jwtService.sign(
      { sub: userId, email },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
      },
    );

    // Calculer la date d'expiration
    const expiresAt = add(new Date(), { hours: 3 });

    // Sauvegarder le refresh token dans la base de données
    await this.databaseService.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    try {
      // Vérifier que le refresh token existe et n'est pas révoqué
      const savedToken = await this.databaseService.refreshToken.findFirst({
        where: {
          token: refreshToken,
          revokedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          user: true,
        },
      });

      if (!savedToken) {
        throw new UnauthorizedException('Refresh token invalide ou expiré');
      }

      // Révoquer l'ancien refresh token
      await this.databaseService.refreshToken.update({
        where: { id: savedToken.id },
        data: { revokedAt: new Date() },
      });

      // Générer de nouveaux tokens
      const tokens = await this.generateTokens(
        savedToken.user.id,
        savedToken.user.email,
      );

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Refresh token invalide');
    }
  }

  async logout(userId: number) {
    // Révoquer tous les refresh tokens de l'utilisateur
    await this.databaseService.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return {
      message: 'Déconnexion réussie',
    };
  }
}

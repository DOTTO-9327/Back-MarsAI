import { describe, it, expect, vi } from 'vitest';
import { login } from './auth.controller.js';
import * as Admin from '../models/admin.model.js';
import bcrypt from 'bcrypt';

vi.mock('../models/admin.model.js');

process.env.JWT_SECRET = 'secret_test';
//  Ce qu'il faut faire :

describe('authController', () => {
  describe('login', () => {
    it("lance une AppError 401 si l'utilisateur n'existe pas", async () => {
      const req = {
        body: {
          mail: 'admin@gmail.com',
          password: 'admintes',
        },
      };
      // Arrange
      Admin.findByEmail.mockResolvedValue(null);

      // On mock l'objet response d'Express (même si on ne s'en sert pas ici, c'est une bonne pratique)
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
      // Act
      await login(req, res).catch(e => e);
      // Assert
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Identifiants invalides', 
      });
    });
  });
});

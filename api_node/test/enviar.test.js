import { getInformacioncursos, getInformacioncursosbyid, getinformaciongradobyid } from '../src/controller/informacioncursos.controller.js';
import { pool } from '../src/db.js';
import sinon from 'sinon';

jest.mock('../src/db.js'); // Mock the pool module

describe('Informacion Cursos Controller', () => {
  let mockQuery;

  beforeEach(() => {
    mockQuery = sinon.stub(pool, 'query');
  });

  afterEach(() => {
    mockQuery.restore();
  });

  // Test for getInformacioncursos
  describe('getInformacioncursos', () => {
    it('should return all courses information', async () => {
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // Mocking the pool.query response with data representative of your database
      mockQuery.resolves([[
        { idInformacion: 1, idUser_fk: 1008, idCourseInProgress_fk: '1008-ICF101', horario: '08:45-09:55 10:15-11:25', fecha: '2024-07-27', ubicacion: '205-D' },
        { idInformacion: 2, idUser_fk: 1008, idCourseInProgress_fk: '1008-ICF101', horario: '15:30-16:40', fecha: '2024-07-28', ubicacion: '202-E' }
      ]]);

      await getInformacioncursos(req, res);
      expect(res.json).toHaveBeenCalledWith([
        { idInformacion: 1, idUser_fk: 1008, idCourseInProgress_fk: '1008-ICF101', horario: '08:45-09:55 10:15-11:25', fecha: '2024-07-27', ubicacion: '205-D' },
        { idInformacion: 2, idUser_fk: 1008, idCourseInProgress_fk: '1008-ICF101', horario: '15:30-16:40', fecha: '2024-07-28', ubicacion: '202-E' }
      ]);
    });

    it('should return 500 if an error occurs', async () => {
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      mockQuery.rejects(new Error('Database error'));

      await getInformacioncursos(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'ERROR: something goes wrong' });
    });
  });

  // Test for getInformacioncursosbyid
  describe('getInformacioncursosbyid', () => {
    it('should return courses information for a given user ID', async () => {
      const req = { params: { idUser_fk: 1008 } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // Mocking the pool.query response
      mockQuery.resolves([[
        { idInformacion: 1, idUser_fk: 1008, idCourseInProgress_fk: '1008-ICF101', horario: '08:45-09:55 10:15-11:25', fecha: '2024-07-27', ubicacion: '205-D' },
        { idInformacion: 2, idUser_fk: 1008, idCourseInProgress_fk: '1008-ICF101', horario: '15:30-16:40', fecha: '2024-07-28', ubicacion: '202-E' }
      ]]);

      await getInformacioncursosbyid(req, res);
      expect(res.json).toHaveBeenCalledWith([
        { idInformacion: 1, idUser_fk: 1008, idCourseInProgress_fk: '1008-ICF101', horario: '08:45-09:55 10:15-11:25', fecha: '2024-07-27', ubicacion: '205-D' },
        { idInformacion: 2, idUser_fk: 1008, idCourseInProgress_fk: '1008-ICF101', horario: '15:30-16:40', fecha: '2024-07-28', ubicacion: '202-E' }
      ]);
    });

    it('should return 404 if no courses found', async () => {
      const req = { params: { idUser_fk: 1008 } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      mockQuery.resolves([[]]);

      await getInformacioncursosbyid(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No se encontró información del curso' });
    });

    it('should return 500 if an error occurs', async () => {
      const req = { params: { idUser_fk: 1008 } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      mockQuery.rejects(new Error('Database error'));

      await getInformacioncursosbyid(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'ERROR: something goes wrong' });
    });
  });

  // Test for getinformaciongradobyid
  describe('getinformaciongradobyid', () => {
    it('should return degree information for a given career ID', async () => {
      const req = { params: { idCarrer_fk: 'ICF' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // Mocking the pool.query response
      mockQuery.resolves([[
        { idCareer: 'ICF', careerName: 'Ingenieria civil informatica', degreeType: 'Licenciatura' }
      ]]);

      await getinformaciongradobyid(req, res);
      expect(res.json).toHaveBeenCalledWith([
        { idCareer: 'ICF', careerName: 'Ingenieria civil informatica', degreeType: 'Licenciatura' }
      ]);
    });

    it('should return 404 if no degree information found', async () => {
      const req = { params: { idCarrer_fk: 'ICF' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      mockQuery.resolves([[]]);

      await getinformaciongradobyid(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No se encontró información del curso' });
    });

    it('should return 500 if an error occurs', async () => {
      const req = { params: { idCarrer_fk: 'ICF' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      mockQuery.rejects(new Error('Database error'));

      await getinformaciongradobyid(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'ERROR: something goes wrong' });
    });
  });
});

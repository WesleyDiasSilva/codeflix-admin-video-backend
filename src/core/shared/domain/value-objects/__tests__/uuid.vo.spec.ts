import { InvalidUuidError, Uuid } from "../uuid.vo"

describe('UUID Unit Tests', () => {
  const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate')

  beforeEach(() => {
    validateSpy.mockClear()
  });
  test('should throw InvalidUuidError when uuid is invalid', () => {
    expect(() => {
      new Uuid('invalid-uuid')
    }).toThrow(new InvalidUuidError())
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })

  test('should create a valid uuid', () => {
    const uuid = new Uuid()
    expect(uuid.id).toBeDefined()
    expect(validateSpy).toHaveBeenCalledTimes(1)
    
  });

  test('should create a valid uuid with a given id', () => {
    const uuid = new Uuid('a1c1c7a1-9f1f-4a1a-8f1f-6a1f1a1e1a1a')
    expect(uuid.id).toBe('a1c1c7a1-9f1f-4a1a-8f1f-6a1f1a1e1a1a')
    expect(validateSpy).toHaveBeenCalledTimes(1)
  });
})
import { ValueObject } from "../value-object";

class StringValueObject extends ValueObject{
  constructor(readonly value: string) {
    super();
  }
}

class ComplexValueObject extends ValueObject{
  constructor(readonly prop1: string, readonly prop2: number) {
    super();
  }
}

describe('ValueObject Unit Tests', () => {
  test('should be equals', () => {
    const vo1 = new StringValueObject('test');
    const vo2 = new StringValueObject('test');

    expect(vo1.equals(vo2)).toBe(true);

    const vo3 = new ComplexValueObject('test', 1);
    const vo4 = new ComplexValueObject('test', 1);

    expect(vo3.equals(vo4)).toBe(true);
  });

  test('should not be equals', () => {
    const vo1 = new StringValueObject('test');
    const vo2 = new StringValueObject('test2');

    expect(vo1.equals(vo2)).toBe(false);
    expect(vo2.equals(null as any)).toBe(false);
    expect(vo2.equals(undefined as any)).toBe(false);

    const vo3 = new ComplexValueObject('test', 1);
    const vo4 = new ComplexValueObject('test', 2);

    expect(vo3.equals(vo4)).toBe(false);
    expect(vo4.equals(null as any)).toBe(false);
    expect(vo4.equals(undefined as any)).toBe(false);
  });
});
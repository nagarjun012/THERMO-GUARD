// =========================================================================
// CENTRALIZED DATA VALIDATION MODULE
// Validates all weather API responses before they are used in calculations.
// Rejects null/undefined/NaN values, physically impossible values,
// and invalid coordinates/timestamps.
// =========================================================================

export interface WeatherInput {
  temperature: number;
  humidity: number;
  windSpeed: number;
  solarRadiation: number;
  windDirection?: number;
  pressureMsl?: number;
  dewPoint?: number;
  apparentTemperature?: number;
  uvIndex?: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  sanitized: WeatherInput | null;
}

// Physically plausible ranges for weather variables
const RANGES = {
  temperature:      { min: -60,  max: 60,   unit: '°C' },
  humidity:         { min: 0,    max: 100,   unit: '%' },
  windSpeed:        { min: 0,    max: 300,   unit: 'km/h' },
  solarRadiation:   { min: 0,    max: 1500,  unit: 'W/m²' },
  windDirection:    { min: 0,    max: 360,   unit: '°' },
  pressureMsl:      { min: 800,  max: 1100,  unit: 'hPa' },
  dewPoint:         { min: -60,  max: 50,    unit: '°C' },
  apparentTemperature: { min: -70, max: 70,  unit: '°C' },
  uvIndex:          { min: 0,    max: 20,    unit: '' },
} as const;

/**
 * Validates a single numeric value.
 * Returns true if the value is a finite number within the specified range.
 */
function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && !Number.isNaN(value);
}

/**
 * Validates a single weather field against its physically plausible range.
 */
function validateField(
  fieldName: string,
  value: unknown,
  range: { min: number; max: number; unit: string },
  required: boolean,
  errors: string[],
  warnings: string[]
): number | undefined {
  if (value === null || value === undefined) {
    if (required) {
      errors.push(`${fieldName} is missing (null/undefined)`);
    }
    return undefined;
  }

  const num = Number(value);

  if (!isValidNumber(num)) {
    if (required) {
      errors.push(`${fieldName} is not a valid number: ${String(value)}`);
    } else {
      warnings.push(`${fieldName} is not a valid number: ${String(value)}`);
    }
    return undefined;
  }

  if (num < range.min || num > range.max) {
    const msg = `${fieldName} value ${num}${range.unit} is outside plausible range [${range.min}, ${range.max}]`;
    if (required) {
      errors.push(msg);
    } else {
      warnings.push(msg);
    }
    return undefined;
  }

  return Math.round(num * 10) / 10;
}

/**
 * Validates latitude/longitude coordinates.
 */
export function validateCoordinates(lat: unknown, lon: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!isValidNumber(Number(lat)) || Number(lat) < -90 || Number(lat) > 90) {
    errors.push(`Invalid latitude: ${String(lat)}. Must be between -90 and 90.`);
  }
  if (!isValidNumber(Number(lon)) || Number(lon) < -180 || Number(lon) > 180) {
    errors.push(`Invalid longitude: ${String(lon)}. Must be between -180 and 180.`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates a timestamp string.
 * Returns true if the timestamp is parseable and not in the far future.
 */
export function validateTimestamp(timestamp: unknown): { valid: boolean; error?: string } {
  if (typeof timestamp !== 'string' || timestamp.trim() === '') {
    return { valid: false, error: 'Timestamp is empty or not a string' };
  }

  const parsed = new Date(timestamp);
  if (isNaN(parsed.getTime())) {
    return { valid: false, error: `Timestamp is not parseable: ${timestamp}` };
  }

  // Allow up to 1 hour in the future (clock skew tolerance)
  const maxFuture = Date.now() + 60 * 60 * 1000;
  if (parsed.getTime() > maxFuture) {
    return { valid: false, error: `Timestamp is too far in the future: ${timestamp}` };
  }

  return { valid: true };
}

/**
 * Validates a complete weather API response.
 * Required fields: temperature, humidity, windSpeed, solarRadiation
 * Optional fields: windDirection, pressureMsl, dewPoint, apparentTemperature, uvIndex
 *
 * Returns a ValidationResult with:
 * - valid: true only if ALL required fields are present and physically plausible
 * - errors: list of critical validation failures
 * - warnings: list of non-critical issues
 * - sanitized: cleaned WeatherInput (null if invalid)
 */
export function validateWeatherData(raw: Record<string, unknown>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate required fields
  const temperature = validateField('temperature', raw.temperature, RANGES.temperature, true, errors, warnings);
  const humidity = validateField('humidity', raw.humidity, RANGES.humidity, true, errors, warnings);
  const windSpeed = validateField('windSpeed', raw.windSpeed, RANGES.windSpeed, true, errors, warnings);
  const solarRadiation = validateField('solarRadiation', raw.solarRadiation, RANGES.solarRadiation, true, errors, warnings);

  // Validate optional fields
  const windDirection = validateField('windDirection', raw.windDirection, RANGES.windDirection, false, errors, warnings);
  const pressureMsl = validateField('pressureMsl', raw.pressureMsl, RANGES.pressureMsl, false, errors, warnings);
  const dewPoint = validateField('dewPoint', raw.dewPoint, RANGES.dewPoint, false, errors, warnings);
  const apparentTemperature = validateField('apparentTemperature', raw.apparentTemperature, RANGES.apparentTemperature, false, errors, warnings);
  const uvIndex = validateField('uvIndex', raw.uvIndex, RANGES.uvIndex, false, errors, warnings);

  const valid = errors.length === 0 &&
    temperature !== undefined &&
    humidity !== undefined &&
    windSpeed !== undefined &&
    solarRadiation !== undefined;

  const sanitized: WeatherInput | null = valid
    ? {
        temperature: temperature!,
        humidity: humidity!,
        windSpeed: windSpeed!,
        solarRadiation: solarRadiation!,
        windDirection,
        pressureMsl,
        dewPoint,
        apparentTemperature,
        uvIndex,
      }
    : null;

  return { valid, errors, warnings, sanitized };
}

/**
 * Quick validation for the 4 core HTSS inputs.
 * Returns true only if all 4 are valid finite numbers within plausible ranges.
 */
export function validateHTSSInputs(
  temp: unknown,
  rh: unknown,
  wind: unknown,
  solar: unknown
): boolean {
  const t = Number(temp);
  const h = Number(rh);
  const w = Number(wind);
  const s = Number(solar);

  return (
    isValidNumber(t) && t >= RANGES.temperature.min && t <= RANGES.temperature.max &&
    isValidNumber(h) && h >= RANGES.humidity.min && h <= RANGES.humidity.max &&
    isValidNumber(w) && w >= RANGES.windSpeed.min && w <= RANGES.windSpeed.max &&
    isValidNumber(s) && s >= RANGES.solarRadiation.min && s <= RANGES.solarRadiation.max
  );
}

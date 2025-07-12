import { environment } from '../environments/environment';

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  context?: Record<string, any>;
}

export interface UserInteraction {
  action: string;
  screen: string;
  timestamp: number;
  duration?: number;
  success?: boolean;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private interactions: UserInteraction[] = [];
  private startTimes: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(name: string): void {
    this.startTimes.set(name, Date.now());
  }

  endTimer(name: string, context?: Record<string, any>): number {
    const startTime = this.startTimes.get(name);
    if (!startTime) {
      console.warn(`Timer '${name}' was not started`);
      return 0;
    }

    const duration = Date.now() - startTime;
    this.recordMetric(name, duration, 'ms', context);
    this.startTimes.delete(name);
    return duration;
  }

  recordMetric(name: string, value: number, unit: string, context?: Record<string, any>): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      context
    };

    this.metrics.push(metric);

    if (!environment.production) {
      console.log(`Performance Metric: ${name} = ${value}${unit}`, context);
    }
  }

  recordInteraction(action: string, screen: string, duration?: number, success?: boolean): void {
    const interaction: UserInteraction = {
      action,
      screen,
      timestamp: Date.now(),
      duration,
      success
    };

    this.interactions.push(interaction);

    if (!environment.production) {
      console.log('User Interaction:', interaction);
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getInteractions(): UserInteraction[] {
    return [...this.interactions];
  }

  clearData(): void {
    this.metrics = [];
    this.interactions = [];
    this.startTimes.clear();
  }

  // Send performance data to analytics service
  sendToAnalytics(): void {
    if (environment.production && (this.metrics.length > 0 || this.interactions.length > 0)) {
      try {
        // In production, implement analytics service integration
        // Examples: Firebase Analytics, Mixpanel, Amplitude, etc.
        const data = {
          metrics: this.metrics,
          interactions: this.interactions,
          timestamp: Date.now()
        };

        // Example: Analytics.track('performance_data', data);
        console.warn('Analytics not implemented. Data:', data);
      } catch (error) {
        console.error('Failed to send performance data:', error);
      }
    }
  }
}

// Global performance monitor
export const performanceMonitor = PerformanceMonitor.getInstance();

// Performance decorator for functions
export function measurePerformance(name: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      performanceMonitor.startTimer(name);
      try {
        const result = await method.apply(this, args);
        performanceMonitor.endTimer(name, { success: true });
        return result;
      } catch (error) {
        performanceMonitor.endTimer(name, { success: false, error: error instanceof Error ? error.message : String(error) });
        throw error;
      }
    };
  };
} 
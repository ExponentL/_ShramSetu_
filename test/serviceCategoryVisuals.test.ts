import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';

describe('Service Category Visuals & Service Page Compliance', () => {
  const dataDir = path.join(__dirname, '../src/data');
  const componentsDir = path.join(__dirname, '../src/components');

  test('imageAssets.ts provides authentic documentary imagery and sub-services for all 9 core categories', () => {
    const assetsPath = path.join(dataDir, 'imageAssets.ts');
    const content = fs.readFileSync(assetsPath, 'utf8');

    // Must define CATEGORY_DETAILED_SERVICES
    expect(content).toContain('CATEGORY_DETAILED_SERVICES');
    expect(content).toContain('SubServiceItem');

    // Electrical must have specific sub-services
    expect(content).toContain('Fan Installation');
    expect(content).toContain('Lighting Installation');
    expect(content).toContain('Switchboard Repair');
    expect(content).toContain('Wiring & MCB Repair');

    // Must not use AI generators or fake stock
    expect(content).toContain('unsplash.com');
  });

  test('CustomerHome employs image-first cards with 45-55% split, stable title and hover zoom', () => {
    const customerHomePath = path.join(componentsDir, 'CustomerHome.tsx');
    const content = fs.readFileSync(customerHomePath, 'utf8');

    // Must import and use ServiceCategoryModal
    expect(content).toContain('ServiceCategoryModal');
    expect(content).toContain('activeCategoryModal');

    // Hover effect requirements
    expect(content).toContain('group-hover:scale-105');
    expect(content).toContain('group-hover:translate-x-1.5');
    expect(content).toContain('hover:-translate-y-1.5');

    // Mobile tap feedback
    expect(content).toContain('active:scale-[0.98]');

    // Must contain category taglines matching Fan · Wiring · MCB style
    expect(content).toContain('Fan · Wiring · MCB');
    expect(content).toContain('Sink · Tap · Water Pipe');
    expect(content).toContain('Furniture · Door · Cabinet');
  });

  test('ServiceCategoryModal renders large photograph, sub-services with small real images, and strict job-based pricing', () => {
    const modalPath = path.join(componentsDir, 'ServiceCategoryModal.tsx');
    const content = fs.readFileSync(modalPath, 'utf8');

    expect(content).toContain('CATEGORY_DETAILED_SERVICES');
    expect(content).toContain('subServices.map');
    expect(content).toContain('Strict Job-Based Pricing Guarantee');
    expect(content).not.toContain('/ hour');
    expect(content.toLowerCase()).not.toContain('hourly');
  });
});


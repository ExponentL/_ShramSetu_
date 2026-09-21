import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';

describe('ShramSetu Marketplace UI Redesign Compliance', () => {
  const componentsDir = path.join(__dirname, '../src/components');

  test('CustomerHome does not include generic AI marketing jargon or hourly tariff calculators', () => {
    const customerHomePath = path.join(componentsDir, 'CustomerHome.tsx');
    const content = fs.readFileSync(customerHomePath, 'utf8');

    // Must not contain AI jargon
    expect(content.toLowerCase()).not.toContain('ai-powered');
    expect(content.toLowerCase()).not.toContain('ai chatbot');
    expect(content.toLowerCase()).not.toContain('ai algorithm');

    // Must not contain hourly pricing
    expect(content.toLowerCase()).not.toContain('hourly tariff');
    expect(content.toLowerCase()).not.toContain('hourly rate');
    expect(content.toLowerCase()).not.toContain('/ hour');

    // Must have genuine marketplace headline
    expect(content).toContain('Get skilled help at your doorstep');
    expect(content).toContain('Bahadurgarh');
  });

  test('WorkerCard uses authentic portraits and strict job-based pricing without base/hourly tags', () => {
    const workerCardPath = path.join(componentsDir, 'WorkerCard.tsx');
    const content = fs.readFileSync(workerCardPath, 'utf8');

    // Must not contain hourly or base rate tags
    expect(content).not.toContain('/ base');
    expect(content).not.toContain('Standard Rate');
    expect(content.toLowerCase()).not.toContain('/ hour');
    expect(content.toLowerCase()).not.toContain('hourly');

    // Must include compact verified badge
    expect(content).toContain('Verified Worker');

    // Must pass photoUrl to avatar
    expect(content).toContain('photoUrl={worker.photoUrl}');
  });

  test('TradeBadgeAvatar supports authentic documentary Indian worker portraits and photoUrl', () => {
    const avatarPath = path.join(componentsDir, 'TradeBadgeAvatar.tsx');
    const content = fs.readFileSync(avatarPath, 'utf8');

    // Must support photoUrl
    expect(content).toContain('photoUrl?: string');
    expect(content).toContain('unsplash.com');

    // Must not hardcode arbitrary robotic initials
    expect(content).toContain('TRADE_DEFAULT_PHOTOS');
  });

  test('Navbar includes trustworthy cooperative branding and clean navigation without AI claims', () => {
    const navbarPath = path.join(componentsDir, 'Navbar.tsx');
    const content = fs.readFileSync(navbarPath, 'utf8');

    // Must have brand identity
    expect(content).toContain('ShramSetu');
    expect(content).toContain('Bahadurgarh');

    // Must not claim AI features
    expect(content.toLowerCase()).not.toContain('ai-powered');
    expect(content.toLowerCase()).not.toContain('ai assistant');
  });

  test('CustomerChatbot is rebranded to Help & Support without robot icons or AI branding', () => {
    const chatbotPath = path.join(componentsDir, 'CustomerChatbot.tsx');
    const content = fs.readFileSync(chatbotPath, 'utf8');

    // Rebranded to Help / Support
    expect(content).toContain('Help & Support');
    expect(content).toContain('Headphones');

    // No hourly calculations
    expect(content.toLowerCase()).not.toContain('/ hour');
    expect(content.toLowerCase()).not.toContain('hourly');
  });

  test('WorkerProfileModal preserves 3-tier verification and multi-provider government checks', () => {
    const profilePath = path.join(componentsDir, 'WorkerProfileModal.tsx');
    const content = fs.readFileSync(profilePath, 'utf8');

    // Must preserve 3-tier verification
    expect(content).toContain('Government Verification');
    expect(content).toContain('Cooperative Verification');
    expect(content).toContain('ShramSetu Verification');

    // Must preserve multi-provider check
    expect(content).toContain('verifyGovernmentOfficial');
    expect(content).toContain('CLC');
    expect(content).toContain('ESHRAM');

    // Strictly job-based pricing notice
    expect(content).toContain('Transparent job-based pricing');
  });

  test('BookingModal strictly adheres to job-based pricing without hourly rates', () => {
    const bookingPath = path.join(componentsDir, 'BookingModal.tsx');
    const content = fs.readFileSync(bookingPath, 'utf8');

    // No hourly rate
    expect(content.toLowerCase()).not.toContain('/ hour');
    expect(content.toLowerCase()).not.toContain('hourly');

    // Preserves 3-tier verification section
    expect(content).toContain('Government Verification');
    expect(content).toContain('Cooperative Verification');
    expect(content).toContain('ShramSetu Verification');
  });

  test('UI responsiveness, sticky filter window sliding, and viewport overflow prevention', () => {
    const cssPath = path.join(__dirname, '../src/index.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    expect(cssContent).toContain('overflow-x: hidden');
    expect(cssContent).toContain('max-width: 100vw');

    // Sticky filter sidebar in CustomerHome must slide down and up as user scrolls
    const customerHomePath = path.join(componentsDir, 'CustomerHome.tsx');
    const customerHomeContent = fs.readFileSync(customerHomePath, 'utf8');
    expect(customerHomeContent).toContain('lg:sticky');
    expect(customerHomeContent).toContain('lg:top-24');
    expect(customerHomeContent).not.toContain('space-y-12 pb-16 w-full max-w-full overflow-hidden');

    const appPath = path.join(__dirname, '../src/App.tsx');
    const appContent = fs.readFileSync(appPath, 'utf8');
    expect(appContent).toContain('w-full max-w-full');

    const workerCardPath = path.join(componentsDir, 'WorkerCard.tsx');
    const workerCardContent = fs.readFileSync(workerCardPath, 'utf8');
    expect(workerCardContent).toContain('whitespace-nowrap');

    const modalPath = path.join(componentsDir, 'WorkerProfileModal.tsx');
    const modalContent = fs.readFileSync(modalPath, 'utf8');
    expect(modalContent).toContain('flex-1 min-h-0');
    expect(modalContent).toContain('shrink-0');
  });

  test('Map system integration across Navbar, CustomerHome, and LeafletMap', () => {
    // 1. Navbar contains Live Map navigation button
    const navbarPath = path.join(componentsDir, 'Navbar.tsx');
    const navbarContent = fs.readFileSync(navbarPath, 'utf8');
    expect(navbarContent).toContain('id="nav-live-tracking"');
    expect(navbarContent).toContain('id="mobile-nav-live-tracking"');
    expect(navbarContent).toContain("setCurrentTab('tracking')");

    // 2. CustomerHome integrates Live Map in Location section and Directory Map View
    const customerHomePath = path.join(componentsDir, 'CustomerHome.tsx');
    const customerHomeContent = fs.readFileSync(customerHomePath, 'utf8');
    expect(customerHomeContent).toContain('id="open-live-map-banner-btn"');
    expect(customerHomeContent).toContain('id="toggle-workers-map-btn"');
    expect(customerHomeContent).toContain('id="toggle-workers-grid-btn"');
    expect(customerHomeContent).toContain('LeafletMap');

    // 3. LeafletMap supports marker click selection
    const mapPath = path.join(componentsDir, 'LeafletMap.tsx');
    const mapContent = fs.readFileSync(mapPath, 'utf8');
    expect(mapContent).toContain('onSelectMarker?: (markerId: string) => void');
  });
});

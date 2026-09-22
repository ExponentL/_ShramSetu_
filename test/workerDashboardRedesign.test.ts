import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';

describe('Worker Dashboard Redesign Verification', () => {
  const componentsDir = path.join(__dirname, '../src/components');
  const workerDashboardPath = path.join(componentsDir, 'WorkerDashboard.tsx');
  const navbarPath = path.join(componentsDir, 'Navbar.tsx');
  const customerHomePath = path.join(componentsDir, 'CustomerHome.tsx');
  const workerDashboardContent = fs.readFileSync(workerDashboardPath, 'utf8');
  const navbarContent = fs.readFileSync(navbarPath, 'utf8');
  const customerHomeContent = fs.readFileSync(customerHomePath, 'utf8');

  test('Worker dashboard removes all customer marketplace functions and terminology', () => {
    // Should NOT have customer marketplace functions
    expect(workerDashboardContent).not.toContain('Find Workers');
    expect(workerDashboardContent).not.toContain('Book a Service');
    expect(workerDashboardContent).not.toContain('Customer marketplace');
    expect(workerDashboardContent).not.toContain('Customer favourites');
    expect(workerDashboardContent).not.toContain('Customer promotional');
  });

  test('Worker side focuses strictly on operational workforce portal requirements', () => {
    // Focus areas
    expect(workerDashboardContent).toContain('Dashboard');
    expect(workerDashboardContent).toContain('My Jobs');
    expect(workerDashboardContent).toContain('Schedule');
    expect(workerDashboardContent).toContain('Availability');
    expect(workerDashboardContent).toContain('Earnings');
    expect(workerDashboardContent).toContain('Live GPS Route Map');
    expect(workerDashboardContent).toContain('3-Tier Verification');
    expect(workerDashboardContent).toContain('Reviews Received');
    expect(workerDashboardContent).toContain('Welfare');
    expect(workerDashboardContent).toContain('Report Unsafe Working Conditions');
    expect(workerDashboardContent).toContain('Cooperative');
    expect(workerDashboardContent).toContain('Help &amp; Support');
  });

  test('Worker header displays ShramSetu logo, worker name, verification, availability, notifications, and profile', () => {
    // Header verification in Navbar.tsx
    expect(navbarContent).toContain('currentRole === \'worker\'');
    expect(navbarContent).toContain('ShramSetu');
    expect(navbarContent).toContain('✓ Verified Worker');
    expect(navbarContent).toContain('● ON DUTY');
    expect(navbarContent).toContain('Off Duty');
    expect(navbarContent).toContain('worker-availability-toggle');
  });

  test('Main dashboard greeting and exact section order', () => {
    // Greeting
    const greetingIdx = workerDashboardContent.indexOf('Good morning,');
    expect(greetingIdx).toBeGreaterThan(-1);

    // Section 1: Active Job
    const activeJobIdx = workerDashboardContent.indexOf('1. Active Job (Main Focus)', greetingIdx);
    expect(activeJobIdx).toBeGreaterThan(greetingIdx);

    // Section 2: Today's Jobs
    const todayJobsIdx = workerDashboardContent.indexOf("2. Today's Jobs", activeJobIdx);
    expect(todayJobsIdx).toBeGreaterThan(activeJobIdx);

    // Section 3: Upcoming Schedule
    const upcomingScheduleIdx = workerDashboardContent.indexOf('3. Upcoming Schedule', todayJobsIdx);
    expect(upcomingScheduleIdx).toBeGreaterThan(todayJobsIdx);

    // Section 4: Earnings
    const earningsIdx = workerDashboardContent.indexOf('4. Earnings', upcomingScheduleIdx);
    expect(earningsIdx).toBeGreaterThan(upcomingScheduleIdx);

    // Section 5: Welfare / Cooperative Updates
    const welfareIdx = workerDashboardContent.indexOf('5. Welfare', earningsIdx);
    expect(welfareIdx).toBeGreaterThan(earningsIdx);
  });

  test('Active Job includes service, job ID, location, requirements, appointment time, and sequential buttons', () => {
    // Key fields
    expect(workerDashboardContent).toContain('Job ID:');
    expect(workerDashboardContent).toContain('Service Location:');
    expect(workerDashboardContent).toContain('Task Requirements:');
    expect(workerDashboardContent).toContain('Appointment time:');
    expect(workerDashboardContent).toContain('Current status:');

    // Sequential progression buttons
    expect(workerDashboardContent).toContain('worker-accept-job-btn');
    expect(workerDashboardContent).toContain('Accept Job');
    expect(workerDashboardContent).toContain('worker-start-trip-btn');
    expect(workerDashboardContent).toContain('Start Travel');
    expect(workerDashboardContent).toContain('worker-arrived-btn');
    expect(workerDashboardContent).toContain('Mark Arrived');
    expect(workerDashboardContent).toContain('worker-begin-work-btn');
    expect(workerDashboardContent).toContain('Start Job');
    expect(workerDashboardContent).toContain('worker-complete-work-btn');
    expect(workerDashboardContent).toContain('Complete Job');
  });

  test('GPS telemetry works only for active/relevant job', () => {
    expect(workerDashboardContent).toContain('setActiveTrackingBookingId(activeJob.id)');
    expect(workerDashboardContent).toContain("setCurrentTab('tracking')");
  });

  test('Mobile navigation uses clean bottom bar for worker: Home | Jobs | Schedule | Earnings | Profile', () => {
    expect(navbarContent).toContain('Worker Mobile Navigation');
    expect(navbarContent).toContain("setCurrentTab('worker_dashboard')");
    expect(navbarContent).toContain("setCurrentTab('worker_jobs')");
    expect(navbarContent).toContain("setCurrentTab('worker_schedule')");
    expect(navbarContent).toContain("setCurrentTab('worker_earnings')");
    expect(navbarContent).toContain("setCurrentTab('worker_profile')");
  });

  test('Strictly zero hourly pricing in WorkerDashboard', () => {
    expect(workerDashboardContent.toLowerCase()).not.toContain('/ hour');
    expect(workerDashboardContent.toLowerCase()).not.toContain('per hour');
    expect(workerDashboardContent.toLowerCase()).not.toContain('hourly rate');
    expect(workerDashboardContent.toLowerCase()).not.toContain('hourly pricing');
    expect(workerDashboardContent).toContain('Fixed Job Payout');
  });

  test('Customer side (CustomerHome.tsx) is preserved without redesign', () => {
    expect(customerHomeContent).toContain('Get skilled help at your doorstep');
    expect(customerHomeContent).toContain('explore-services-section');
    expect(customerHomeContent).toContain('workers-directory-section');
  });
});

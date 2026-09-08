import { TestBed } from '@angular/core/testing';
import { MockApiService } from './mock-api.service';

describe('MockApiService', () => {
  let service: MockApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockApiService);
  });

  it('calculates the public online player count without the proxy', () => {
    expect(service.onlinePlayers()).toBe(231);
  });

  it('starts an available quest explicitly', () => {
    service.startQuest('q2');
    expect(service.quests().find((quest) => quest.id === 'q2')?.status).toBe('active');
  });

  it('claims a completed quest exactly once in the UI state', () => {
    service.claimQuest('q3');
    service.claimQuest('q3');
    expect(service.quests().filter((quest) => quest.id === 'q3')).toHaveLength(1);
    expect(service.quests().find((quest) => quest.id === 'q3')?.status).toBe('claimed');
  });

  it('persists the irreversible leaderboard opt-in for the session', () => {
    service.enableLeaderboard();
    expect(service.leaderboardOptIn()).toBe(true);
  });

  it('creates an auditable manual backup', () => {
    const previousBackups = service.backups().length;
    const previousEntries = service.auditEntries().length;
    service.addBackup('Lobby-1');
    expect(service.backups()).toHaveLength(previousBackups + 1);
    expect(service.auditEntries()).toHaveLength(previousEntries + 1);
    expect(service.backups()[0].status).toBe('running');
  });
});

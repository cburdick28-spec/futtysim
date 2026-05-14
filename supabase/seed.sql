insert into leagues (id, name, country, tier, max_teams, reputation) values
  ('00000000-0000-0000-0000-000000000001', 'Premier League', 'England', 1, 20, 90),
  ('00000000-0000-0000-0000-000000000002', 'La Liga', 'Spain', 1, 20, 89),
  ('00000000-0000-0000-0000-000000000003', 'Serie A', 'Italy', 1, 20, 87),
  ('00000000-0000-0000-0000-000000000004', 'Bundesliga', 'Germany', 1, 18, 88)
on conflict do nothing;

insert into clubs (id, name, short_name, league_id, stadium, budget, reputation, founded, colors, is_ai) values
  ('10000000-0000-0000-0000-000000000001', 'Manchester City', 'MCI', '00000000-0000-0000-0000-000000000001', 'Etihad Stadium', 180000000, 92, 1880, '#6CABDD', true),
  ('10000000-0000-0000-0000-000000000002', 'Arsenal', 'ARS', '00000000-0000-0000-0000-000000000001', 'Emirates Stadium', 120000000, 88, 1886, '#EF0107', true),
  ('10000000-0000-0000-0000-000000000003', 'Real Madrid', 'RMA', '00000000-0000-0000-0000-000000000002', 'Santiago Bernabéu', 200000000, 95, 1902, '#FFFFFF', true),
  ('10000000-0000-0000-0000-000000000004', 'Barcelona', 'BAR', '00000000-0000-0000-0000-000000000002', 'Camp Nou', 170000000, 93, 1899, '#A50044', true),
  ('10000000-0000-0000-0000-000000000005', 'Inter', 'INT', '00000000-0000-0000-0000-000000000003', 'San Siro', 110000000, 87, 1908, '#00529F', true),
  ('10000000-0000-0000-0000-000000000006', 'Bayern Munich', 'FCB', '00000000-0000-0000-0000-000000000004', 'Allianz Arena', 190000000, 94, 1900, '#DC052D', true)
on conflict do nothing;

insert into teams (id, name, country, fifa_rank, reputation) values
  ('20000000-0000-0000-0000-000000000001', 'England', 'England', 4, 88),
  ('20000000-0000-0000-0000-000000000002', 'Spain', 'Spain', 3, 89),
  ('20000000-0000-0000-0000-000000000003', 'Germany', 'Germany', 11, 86),
  ('20000000-0000-0000-0000-000000000004', 'Italy', 'Italy', 8, 87),
  ('20000000-0000-0000-0000-000000000005', 'Argentina', 'Argentina', 1, 92),
  ('20000000-0000-0000-0000-000000000006', 'Brazil', 'Brazil', 5, 91)
on conflict do nothing;

insert into managers (id, name, nationality, reputation, experience, salary, contract_length, team_type, team_id, is_ai) values
  ('30000000-0000-0000-0000-000000000001', 'Pep Sim', 'Spain', 94, 14, 18000000, 4, 'club', '10000000-0000-0000-0000-000000000001', true),
  ('30000000-0000-0000-0000-000000000002', 'Arteta Sim', 'Spain', 86, 6, 9000000, 3, 'club', '10000000-0000-0000-0000-000000000002', true),
  ('30000000-0000-0000-0000-000000000003', 'Ancelotti Sim', 'Italy', 92, 20, 12000000, 2, 'club', '10000000-0000-0000-0000-000000000003', true),
  ('30000000-0000-0000-0000-000000000004', 'Xavi Sim', 'Spain', 84, 4, 8000000, 3, 'club', '10000000-0000-0000-0000-000000000004', true)
on conflict do nothing;

insert into players (first_name, last_name, nationality, age, position, club_id, pace, shooting, passing, dribbling, defending, physical, potential, morale, fitness, form, value, wage, contract_until) values
  ('Erling', 'Haaland', 'Norway', 24, 'ST', '10000000-0000-0000-0000-000000000001', 89, 94, 75, 85, 45, 89, 95, 78, 95, 83, 170000000, 450000, 2029),
  ('Kevin', 'De Bruyne', 'Belgium', 33, 'CM', '10000000-0000-0000-0000-000000000001', 74, 85, 93, 87, 64, 75, 92, 82, 88, 84, 90000000, 380000, 2027),
  ('Bukayo', 'Saka', 'England', 23, 'RW', '10000000-0000-0000-0000-000000000002', 86, 86, 84, 89, 62, 72, 92, 81, 92, 85, 130000000, 260000, 2030),
  ('Jude', 'Bellingham', 'England', 22, 'CAM', '10000000-0000-0000-0000-000000000003', 83, 87, 88, 87, 78, 82, 94, 85, 94, 88, 165000000, 320000, 2030),
  ('Pedri', 'Gonzalez', 'Spain', 22, 'CM', '10000000-0000-0000-0000-000000000004', 80, 79, 90, 89, 70, 68, 93, 79, 90, 84, 140000000, 250000, 2030),
  ('Lautaro', 'Martinez', 'Argentina', 27, 'ST', '10000000-0000-0000-0000-000000000005', 82, 88, 77, 86, 48, 81, 90, 80, 91, 83, 115000000, 280000, 2029),
  ('Jamal', 'Musiala', 'Germany', 22, 'CAM', '10000000-0000-0000-0000-000000000006', 86, 84, 85, 92, 54, 68, 95, 79, 94, 86, 145000000, 240000, 2030)
on conflict do nothing;

insert into seasons (league_id, season_number, year, is_active, matchday, total_matchdays)
select id, 1, 2026, true, 1, case when name = 'Bundesliga' then 34 else 38 end from leagues
on conflict do nothing;

INSERT INTO "user"
  (id, name, role)
VALUES
  ('22584@student.hhs.se', 'Victor Andrée', 'admin');

INSERT INTO "course"
  (id, name)
VALUES
  ('404', 'Microeconomics'),
  ('210', 'Marketing I'),
  ('317', 'Introduction to the Law of Business & Commerce'),
  ('601', 'Basic Economic Statistics I'),
  ('602', 'Basic Economic Statistics II'),
  ('300', 'Introduction to Accounting'),
  ('211', 'Marketing II'),
  ('301', 'Managerial Economics and Control'),
  ('700', 'International Economics'),
  ('313', 'Finance I'),
  ('191', 'Management: Organization'),
  ('302', 'Accounting and Managerial Finance'),
  ('192', 'Management: Leadership'),
  ('407', 'Macroeconomics and Economic Policy'),
  ('730', 'Finance II'),
  ('314', 'Business Strategy');

INSERT INTO "course_page"
  (course_id, body)
VALUES
  ('404',
    E'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.\n'
    '\n'
    '*Lorem ipsum dolor sit amet*, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.'),
  ('210', ''),
  ('317', ''),
  ('601', ''),
  ('602', ''),
  ('300', ''),
  ('211', ''),
  ('301', ''),
  ('700', ''),
  ('313', ''),
  ('191', ''),
  ('302', ''),
  ('192', ''),
  ('407', ''),
  ('730', ''),
  ('314', '');

INSERT INTO "course_contribution"
  (course_id, user_id, contribution)
VALUES
  ('404', '22584@student.hhs.se', 100),
  ('407', '22584@student.hhs.se', 100);

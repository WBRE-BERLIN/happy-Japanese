<?php

declare(strict_types=1);

/*
 * Accounts from the command line (there is no admin page):
 *   php tools/user.php list
 *   php tools/user.php password <username>      sets a new password (asks for it)
 *   php tools/user.php delete <username>
 */
if (PHP_SAPI !== 'cli') {
    exit;
}
$config = require __DIR__ . '/../src/bootstrap.php';
$app = new HappyJapanese\App($config);
[$command, $name] = [$argv[1] ?? 'help', $argv[2] ?? ''];

switch ($command) {
    case 'list':
        foreach ($app->db->all('SELECT u.username, u.display_name, u.created_at, u.last_seen_at, (SELECT COUNT(*) FROM attempts a WHERE a.user_id = u.id) AS answers FROM users u ORDER BY u.username') as $row) {
            printf("%-24s %-20s seit %s, zuletzt %s, %d Antworten\n", $row['username'], $row['display_name'], substr((string) $row['created_at'], 0, 10), substr((string) $row['last_seen_at'], 0, 10), $row['answers']);
        }
        break;
    case 'password':
        echo 'Neues Passwort: ';
        $password = trim((string) fgets(STDIN));
        $app->auth->resetPassword($name, $password);
        echo "Passwort geändert, alle Geräte abgemeldet.\n";
        break;
    case 'delete':
        $app->db->run('DELETE FROM users WHERE username = ?', [$name]);
        echo "Gelöscht (falls vorhanden): {$name}\n";
        break;
    default:
        echo "php tools/user.php list | password <name> | delete <name>\n";
}

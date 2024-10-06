/**
 * Schließt das aktuelle Browserfenster oder Tab.
 * 
 * Hinweis: Diese Funktion funktioniert nur unter bestimmten Bedingungen, z.B. wenn das Fenster durch JavaScript geöffnet wurde
 * (normalerweise mit `window.open`). Browser beschränken aus Sicherheitsgründen das Schließen von Tabs/Fenstern, die
 * nicht durch JavaScript geöffnet wurden.
 */
function closeTab() {
    window.close();
}

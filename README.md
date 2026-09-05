# Konya Clothing V3.14 – Richtige öffentliche Homepage

Diese Version trennt die öffentliche Website klar vom internen Adminbereich.

## Die 5 großen Schritte

1. **Öffentliche Homepage unter /**
   Kunden sehen nur die normale Konya-Clothing-Website mit Header, Leistungen, Showcase, Preisen und Call-to-Action.

2. **Eigene Seiten**
   - `/showcase`
   - `/preise`
   - `/auftrag`
   - `/kundenbereich`

3. **Adminbereich separat unter `/admin`**
   Die interne Navigation und das Dashboard werden nicht mehr auf der öffentlichen Homepage angezeigt.

4. **Professioneller Header + Footer**
   Logo, Navigation, klare Buttons, mobile Navigation und Footer wurden als echte Website-Struktur aufgebaut.

5. **Railway-kompatible Routen**
   Express liefert alle öffentlichen Seiten und `/admin` direkt aus. PostgreSQL und die bisherige Backend-Synchronisierung bleiben erhalten.

## Wichtig

Der Adminbereich ist jetzt optisch und per URL getrennt, aber noch nicht durch einen echten Login geschützt. Das sollte als nächster Schritt umgesetzt werden.

import math
from app.config import settings
from app.models.schemas import ThermalStressData

class ThermalStressService:
    def calculate_all(self, temp_c: float, humidity: float, wind_kmh: float, solar_rad: float) -> ThermalStressData:
        temp_f = temp_c * 1.8 + 32
        
        # 1. Heat Index
        hi_f = self._calculate_heat_index(temp_f, humidity)
        hi_c = (hi_f - 32) / 1.8
        hi_cat = self._get_hi_category(hi_c)
        
        # 2. WBGT
        wbgt_c = self._calculate_wbgt(temp_c, humidity, solar_rad)
        wbgt_cat = self._get_wbgt_category(wbgt_c)
        
        # 3. UTCI
        utci_c = self._calculate_utci(temp_c, humidity, wind_kmh, solar_rad)
        utci_cat = self._get_utci_category(utci_c)
        
        # 4. HTSS
        score, cat, contribs = self._calculate_htss(hi_c, wbgt_c, utci_c)
        
        return ThermalStressData(
            heat_index=round(hi_c, 1),
            heat_index_category=hi_cat,
            wbgt=round(wbgt_c, 1),
            wbgt_category=wbgt_cat,
            utci=round(utci_c, 1),
            utci_category=utci_cat,
            htss_score=round(score, 1),
            htss_category=cat,
            contributions=contribs
        )

    def _calculate_heat_index(self, t: float, rh: float) -> float:
        hi = 0.5 * (t + 61.0 + ((t - 68.0) * 1.2) + (rh * 0.094))
        if hi >= 80:
            hi = -42.379 + 2.04901523*t + 10.14333127*rh - 0.22475541*t*rh - 0.00683783*t*t - 0.05481717*rh*rh + 0.00122874*t*t*rh + 0.00085282*t*rh*rh - 0.00000199*t*t*rh*rh
            if rh < 13 and 80 <= t <= 112:
                adj = ((13 - rh)/4) * math.sqrt((17 - abs(t - 95))/17)
                hi -= adj
            elif rh > 85 and 80 <= t <= 87:
                adj = ((rh - 85)/10) * ((87 - t)/5)
                hi += adj
        return hi

    def _get_hi_category(self, hi_c: float) -> str:
        if hi_c < 27: return "Safe"
        if hi_c < 32: return "Caution"
        if hi_c < 41: return "Extreme Caution"
        if hi_c < 54: return "Danger"
        return "Extreme Danger"

    def _calculate_wbgt(self, t: float, rh: float, sr: float) -> float:
        # e = vapor pressure
        e = (rh / 100.0) * 6.105 * math.exp(17.27 * t / (237.7 + t))
        swbgt = 0.567 * t + 0.393 * e + 3.94
        if sr > 100:
            swbgt += (sr * 0.01) # simplified solar addition
        return swbgt

    def _get_wbgt_category(self, wbgt: float) -> str:
        if wbgt < 27.7: return "Low"
        if wbgt < 29.4: return "Moderate"
        if wbgt < 31.0: return "High"
        if wbgt < 32.2: return "Very High"
        return "Extreme"

    def _calculate_utci(self, t: float, rh: float, v: float, sr: float) -> float:
        v_ms = v * 0.27778
        tmrt = t + 0.08 * sr - 1.2 * math.sqrt(v_ms) if sr > 0 else t
        # Simplified regression for UTCI
        dt = tmrt - t
        utci = t + 0.2 * dt - 0.1 * v_ms + 0.05 * rh
        return utci

    def _get_utci_category(self, utci: float) -> str:
        if utci < 9: return "Cold Stress"
        if utci <= 26: return "No Thermal Stress"
        if utci <= 32: return "Moderate Heat Stress"
        if utci <= 38: return "Strong Heat Stress"
        if utci <= 46: return "Very Strong Heat Stress"
        return "Extreme Heat Stress"

    def _calculate_htss(self, hi: float, wbgt: float, utci: float):
        n_hi = min(100, max(0, (hi - 25) * 3))
        n_wbgt = min(100, max(0, (wbgt - 20) * 4))
        n_utci = min(100, max(0, (utci - 20) * 2.5))

        w_utci = settings.WEIGHT_UTCI
        w_wbgt = settings.WEIGHT_WBGT
        w_hi = settings.WEIGHT_HI

        weighted = (n_utci * w_utci) + (n_wbgt * w_wbgt) + (n_hi * w_hi)
        max_sub = max(n_hi, n_wbgt, n_utci)
        
        # Non-compensatory safeguard
        score = max(weighted, 0.85 * max_sub)

        cat = "Low"
        if score >= 75:
            cat = "Extreme"
        elif score >= 60:
            cat = "High"
        elif score >= 40:
            cat = "Moderate"

        contribs = {
            "UTCI": round(n_utci * w_utci / score * 100 if score > 0 else 0, 1),
            "WBGT": round(n_wbgt * w_wbgt / score * 100 if score > 0 else 0, 1),
            "HeatIndex": round(n_hi * w_hi / score * 100 if score > 0 else 0, 1)
        }
        return score, cat, contribs

thermal_stress_service = ThermalStressService()

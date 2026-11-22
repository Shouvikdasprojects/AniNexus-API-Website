"""
AniNexus Official Python Client SDK

A lightweight, zero-dependency Python wrapper for the AniNexus Anime REST Platform.
Works with Python 3.8+ using urllib (no third-party dependencies required).

Author: Shouvik Das
License: MIT
"""

import json
import urllib.parse
import urllib.request
import urllib.error
from typing import Optional, Dict, Any, Union

class AniNexusError(Exception):
    """Base exception for AniNexus API errors"""
    pass

class RateLimitError(AniNexusError):
    """Raised when the 90 req/min rate limit is exceeded"""
    pass

class ResourceExpiredError(AniNexusError):
    """Raised when accessing pruned data outside the 5-year awards retention (HTTP 410)"""
    pass

class AniNexus:
    def __init__(self, base_url: str = "https://ani-nexus.onrender.com/api/v1", timeout: int = 10):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    def _request(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        endpoint = "/" + endpoint.lstrip("/")
        url = self.base_url + endpoint

        if params:
            filtered_params = {k: v for k, v in params.items() if v is not None}
            if filtered_params:
                url += "?" + urllib.parse.urlencode(filtered_params)

        req = urllib.request.Request(
            url,
            headers={
                "Accept": "application/json",
                "User-Agent": "AniNexus-Python-SDK/1.0"
            }
        )

        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as response:
                body = response.read().decode("utf-8")
                return json.loads(body)
        except urllib.error.HTTPError as err:
            if err.code == 429:
                raise RateLimitError("AniNexus Rate Limit Exceeded: Maximum 90 requests per minute allowed.")
            elif err.code == 410:
                raise ResourceExpiredError("Resource Expired (410): Content is outside the 5-year retention window.")
            raise AniNexusError(f"AniNexus HTTP Error {err.code}: {err.reason}")
        except urllib.error.URLError as err:
            raise AniNexusError(f"Connection failed: {err.reason}")

    # --- Master Franchise Timelines ---
    def get_series(self, slug: str) -> Dict[str, Any]:
        """Fetch consolidated franchise dossier and metadata."""
        return self._request(f"/series/{slug}")

    def get_timeline(self, slug: str) -> Dict[str, Any]:
        """Fetch chronological watch order across all seasons, movies, and specials."""
        return self._request(f"/series/{slug}/timeline")

    def get_episodes(self, slug: str) -> Dict[str, Any]:
        """Fetch complete episode directory with canon/filler classifications."""
        return self._request(f"/series/{slug}/episodes")

    # --- Granular Anime & Languages ---
    def get_anime(self, id_or_slug: Union[str, int]) -> Dict[str, Any]:
        """Fetch single anime season or movie part."""
        return self._request(f"/anime/{id_or_slug}")

    def get_languages(self, id_or_slug: Union[str, int]) -> Dict[str, Any]:
        """Fetch granular per-part audio dub and subtitle matrix (Hindi, English, etc.)."""
        return self._request(f"/anime/{id_or_slug}/languages")

    # --- Leaderboards & Seasons ---
    def get_top(self, type: str = "trending", limit: int = 20) -> Dict[str, Any]:
        """Fetch top collections: trending, popular, rated, movies, or airing."""
        return self._request("/top", {"type": type, "limit": limit})

    def get_seasons_now(self, limit: int = 20) -> Dict[str, Any]:
        """Fetch anime airing in the current broadcast season."""
        return self._request("/seasons/now", {"limit": limit})

    def get_seasons_upcoming(self, limit: int = 20) -> Dict[str, Any]:
        """Fetch upcoming releases for future broadcast cycles."""
        return self._request("/seasons/upcoming", {"limit": limit})

    # --- Schedule & News ---
    def get_schedule(self) -> Dict[str, Any]:
        """Fetch weekly 7-day broadcast calendar."""
        return self._request("/schedule")

    def get_news(self, limit: int = 20) -> Dict[str, Any]:
        """Fetch industry news articles with guaranteed high-resolution covers."""
        return self._request("/news", {"limit": limit})

    # --- Awards Vault ---
    def get_awards_latest(self) -> Dict[str, Any]:
        """Fetch the latest edition Industry Anime Awards winners & nominees."""
        return self._request("/awards/latest")

    # --- Characters & Staff ---
    def get_character(self, id_or_slug: Union[str, int]) -> Dict[str, Any]:
        """Fetch character dossier with traits and multilingual voice actors."""
        return self._request(f"/characters/{id_or_slug}")

    def search_characters(self, query: str) -> Dict[str, Any]:
        """Search character encyclopedia by name or alias."""
        return self._request("/characters/search", {"q": query})

    def get_staff(self, id_or_slug: Union[str, int]) -> Dict[str, Any]:
        """Fetch voice actor or creator production profile."""
        return self._request(f"/staff/{id_or_slug}")

    def search_staff(self, query: str) -> Dict[str, Any]:
        """Search industry creators and voice actors."""
        return self._request("/staff/search", {"q": query})

    # --- Omni Search ---
    def search(self, query: str) -> Dict[str, Any]:
        """Full-text typo-tolerant search across Romaji, English, and Kanji."""
        return self._request("/search", {"q": query})

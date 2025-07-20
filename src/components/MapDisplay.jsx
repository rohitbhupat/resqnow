import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../assets/mapbeacon.css'; // Your beacon CSS

mapboxgl.accessToken = 'pk.eyJ1IjoiYmh1cGF0cnVoYWFuIiwiYSI6ImNtZDZ4NGV1NDBmMjkya3NjM3l3ZXp6d2oifQ.zIcvqlwpZDa02_Ms4EhNOw';

const getStatusColor = (status) => {
  if (status?.toLowerCase() === 'resolved') return 'green';
  return 'red';
};

const MapDisplay = ({ alerts = [] }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

  const clearMarkers = () => {
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
  };

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [77.2090, 28.6139],
        zoom: 5,
      });
    }
  }, []);

  useEffect(() => {
    if (!map.current || alerts.length === 0) return;

    clearMarkers();
    const bounds = new mapboxgl.LngLatBounds();

    alerts.forEach(alert => {
      let lat, lng;

      if (typeof alert.location === 'string' && alert.location.includes(',')) {
        const [latStr, lngStr] = alert.location.split(',');
        lat = parseFloat(latStr);
        lng = parseFloat(lngStr);
      }

      if (!lat || !lng || isNaN(lat) || isNaN(lng)) return;

      const el = document.createElement('div');
      el.className = 'beacon-marker';
      el.style.backgroundColor = getStatusColor(alert.status);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup().setText(alert.message || "SOS Alert"))
        .addTo(map.current);

      markers.current.push(marker);
      bounds.extend([lng, lat]);
    });

    if (!bounds.isEmpty()) {
      map.current.fitBounds(bounds, { padding: 60 });
    }

  }, [alerts]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '700px',
        position: 'relative',
        borderRadius: '10px',
        overflow: 'hidden',
      }}
    />
  );
};

export default MapDisplay;
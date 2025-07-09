import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYmh1cGF0cnVoYWFuIiwiYSI6ImNtY3NvN3BoMzEyY3YybXNicHRnOTlpbG0ifQ.n4ENglW-EbD6MMOzN-MreA';

const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
        case 'low': return 'green';
        case 'medium': return 'orange';
        case 'high': return 'red';
        case 'critical': return 'black';
        default: return 'blue';
    }
};

const MapDisplay = ({ alerts = [], focusLat = 28.6139, focusLng = 77.2090 }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const markers = useRef([]);

    // Clean up old markers
    const clearMarkers = () => {
        markers.current.forEach(marker => marker.remove());
        markers.current = [];
    };

    useEffect(() => {
        if (!map.current && mapContainer.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [focusLng, focusLat],
                zoom: 10,
            });
        }
    }, [focusLat, focusLng]);

    useEffect(() => {
        if (!map.current || alerts.length === 0) return;

        clearMarkers();

        const bounds = new mapboxgl.LngLatBounds();

        alerts.forEach(alert => {
            let [lat, lng] = [28.6139, 77.2090]; // default coords
            if (typeof alert.location === 'string' && alert.location.includes(',')) {
                const [latStr, lngStr] = alert.location.split(',');
                lat = parseFloat(latStr);
                lng = parseFloat(lngStr);
            } else if (alert.lat && alert.lng) {
                lat = alert.lat;
                lng = alert.lng;
            }

            const marker = new mapboxgl.Marker({ color: getUrgencyColor(alert.urgency) })
                .setLngLat([lng, lat])
                .setPopup(new mapboxgl.Popup().setText(alert.message || "SOS Alert"))
                .addTo(map.current);

            markers.current.push(marker);
            bounds.extend([lng, lat]);

            // Optional responder marker
            if (alert.responder_lat && alert.responder_lng) {
                const responderMarker = new mapboxgl.Marker({ color: 'blue' })
                    .setLngLat([alert.responder_lng, alert.responder_lat])
                    .setPopup(new mapboxgl.Popup().setText("Responder"))
                    .addTo(map.current);

                markers.current.push(responderMarker);
                bounds.extend([alert.responder_lng, alert.responder_lat]);
            }
        });

        if (!bounds.isEmpty()) {
            map.current.fitBounds(bounds, { padding: 50 });
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
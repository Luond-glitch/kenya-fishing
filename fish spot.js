// Initialize Mapbox
        mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
        
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [39.9062, -4.0435], // Default center on Kenya's coast
            zoom: 7
        });
        
        // Sample data for beaches and fishing spots in Kenya with fish information
        const locations = {
            beaches: [
                {
                    name: "Diani Beach",
                    description: "One of Kenya's most beautiful beaches with white sand and clear waters. Excellent for snorkeling and dolphin watching.",
                    coordinates: [39.5850, -4.3267],
                    fishSpecies: [
                        { name: "Parrotfish", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Scaridae.jpg" },
                        { name: "Butterflyfish", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Chaeidae.jpg" },
                        { name: "Moray Eel", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Muraenidae.jpg" },
                        { name: "Reef Shark", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Carcharhinidae.jpg" }
                    ]
                },
                {
                    name: "Nyali Beach",
                    description: "Popular beach near Mombasa with great resorts and water sports. Good for reef fishing.",
                    coordinates: [39.6708, -4.0435],
                    fishSpecies: [
                        { name: "Emperor", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Lethrinidae.jpg" },
                        { name: "Snapper", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Lutjanidae.jpg" },
                        { name: "Grouper", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Serranidae.jpg" }
                    ]
                },
                {
                    name: "Watamu Beach",
                    description: "Known for its marine park and excellent snorkeling opportunities. Home to diverse marine life.",
                    coordinates: [40.0180, -3.3538],
                    fishSpecies: [
                        { name: "Lionfish", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Pteroinae.jpg" },
                        { name: "Angelfish", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Pomacanthidae.jpg" },
                        { name: "Barracuda", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Sphyraenidae.jpg" }
                    ]
                },
                {
                    name: "Malindi Beach",
                    description: "Historic beach town with Italian influences and great seafood. Popular for big game fishing.",
                    coordinates: [40.1167, -3.2167],
                    fishSpecies: [
                        { name: "Sailfish", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Istiophoridae.jpg" },
                        { name: "Marlin", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Istiophoridae.jpg" },
                        { name: "Tuna", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Scombridae.jpg" }
                    ]
                },
                {
                    name: "Lamu Beach",
                    description: "Tranquil beach with Swahili cultural experiences. Traditional fishing methods still used.",
                    coordinates: [40.9000, -2.2694],
                    fishSpecies: [
                        { name: "Kingfish", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Scomberomorini.jpg" },
                        { name: "Trevaly", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Carangidae.jpg" },
                        { name: "Octopus", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Octopodidae.jpg" }
                    ]
                }
            ],
            fishingSpots: [
                {
                    name: "Shimoni Fishing Area",
                    description: "Excellent deep sea fishing spot near the Tanzanian border. Known for big game fish.",
                    coordinates: [39.3814, -4.6476],
                    fishSpecies: [
                        { name: "Dogtooth Tuna", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Gymnosarda.jpg" },
                        { name: "Wahoo", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Acanthocybium.jpg" },
                        { name: "Dorado", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Coryphaenidae.jpg" }
                    ]
                },
                {
                    name: "Kilifi Fishing Grounds",
                    description: "Productive fishing area with abundant marine life. Good for both reef and deep sea fishing.",
                    coordinates: [39.8499, -3.6304],
                    fishSpecies: [
                        { name: "GT (Giant Trevally)", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Caranx_ignobilis.jpg" },
                        { name: "Jobfish", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Aphareidae.jpg" },
                        { name: "Rainbow Runner", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Elagatis.jpg" }
                    ]
                },
                {
                    name: "Mombasa Fishing Pier",
                    description: "Popular spot for shore fishing and night fishing. Catches include smaller reef species.",
                    coordinates: [39.6653, -4.0636],
                    fishSpecies: [
                        { name: "Rabbitfish", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Siganidae.jpg" },
                        { name: "Goatfish", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Mullidae.jpg" },
                        { name: "Pufferfish", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Tetraodontidae.jpg" }
                    ]
                },
                {
                    name: "Lamu Archipelago Fishing",
                    description: "Traditional fishing methods still used in these rich fishing grounds. Seasonal variations in catches.",
                    coordinates: [40.8333, -2.1667],
                    fishSpecies: [
                        { name: "Mud Crab", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Scylla.jpg" },
                        { name: "Prawns", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Penaeus.jpg" },
                        { name: "Mullet", image: "https://www.fishbase.se/images/thumbnails/jpg/tn_Mugilidae.jpg" }
                    ]
                }
            ]
        };
        
        // Add markers when map loads
        map.on('load', () => {
            // Add beaches
            locations.beaches.forEach(beach => {
                const el = document.createElement('div');
                el.className = 'marker-beach';
                
                // Create fish gallery HTML
                let fishGallery = '';
                if (beach.fishSpecies && beach.fishSpecies.length > 0) {
                    fishGallery = '<div class="fish-gallery">';
                    beach.fishSpecies.forEach(fish => {
                        fishGallery += `
                            <div class="fish-item">
                                <img src="${fish.image}" alt="${fish.name}" class="fish-image">
                                <div class="fish-name">${fish.name}</div>
                            </div>
                        `;
                    });
                    fishGallery += '</div>';
                }
                
                new mapboxgl.Marker(el)
                    .setLngLat(beach.coordinates)
                    .setPopup(new mapboxgl.Popup({ offset: 25 })
                        .setHTML(`
                            <h3>${beach.name}</h3>
                            <p>${beach.description}</p>
                            <p><strong>Common Fish Species:</strong></p>
                            ${fishGallery}
                        `))
                    .addTo(map);
            });
            
            // Add fishing spots
            locations.fishingSpots.forEach(spot => {
                const el = document.createElement('div');
                el.className = 'marker-fishing';
                
                // Create fish gallery HTML
                let fishGallery = '';
                if (spot.fishSpecies && spot.fishSpecies.length > 0) {
                    fishGallery = '<div class="fish-gallery">';
                    spot.fishSpecies.forEach(fish => {
                        fishGallery += `
                            <div class="fish-item">
                                <img src="${fish.image}" alt="${fish.name}" class="fish-image">
                                <div class="fish-name">${fish.name}</div>
                            </div>
                        `;
                    });
                    fishGallery += '</div>';
                }
                
                new mapboxgl.Marker(el)
                    .setLngLat(spot.coordinates)
                    .setPopup(new mapboxgl.Popup({ offset: 25 })
                        .setHTML(`
                            <h3>${spot.name}</h3>
                            <p>${spot.description}</p>
                            <p><strong>Target Species:</strong></p>
                            ${fishGallery}
                        `))
                    .addTo(map);
            });
            
            // Add geolocate control
            map.addControl(
                new mapboxgl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true
                    },
                    trackUserLocation: true,
                    showUserLocation: true,
                    showAccuracyCircle: false
                })
            );
        });
        
        // Custom locate button functionality
        document.getElementById('locate-btn').addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const userLocation = [position.coords.longitude, position.coords.latitude];
                        map.flyTo({
                            center: userLocation,
                            zoom: 12,
                            essential: true
                        });
                        
                        // Display distance to nearest beach/fishing spot
                        findNearestLocation(userLocation);
                    },
                    error => {
                        document.getElementById('location-info').innerHTML = 
                            `<p style="color: red;">Error getting location: ${error.message}</p>`;
                    },
                    { enableHighAccuracy: true }
                );
            } else {
                document.getElementById('location-info').innerHTML = 
                    '<p style="color: red;">Geolocation is not supported by your browser</p>';
            }
        });
        
        // Function to find nearest location
        function findNearestLocation(userLocation) {
            let nearestBeach = null;
            let minBeachDistance = Infinity;
            
            let nearestFishingSpot = null;
            let minFishingDistance = Infinity;
            
            // Calculate distances to beaches
            locations.beaches.forEach(beach => {
                const distance = calculateDistance(userLocation, beach.coordinates);
                if (distance < minBeachDistance) {
                    minBeachDistance = distance;
                    nearestBeach = beach;
                }
            });
            
            // Calculate distances to fishing spots
            locations.fishingSpots.forEach(spot => {
                const distance = calculateDistance(userLocation, spot.coordinates);
                if (distance < minFishingDistance) {
                    minFishingDistance = distance;
                    nearestFishingSpot = spot;
                }
            });
            
            // Display results
            let infoHTML = '';
            
            if (nearestBeach) {
                infoHTML += `<p><strong>Nearest Beach:</strong> ${nearestBeach.name} (${minBeachDistance.toFixed(1)} km away)</p>`;
                infoHTML += `<p>Common fish: ${nearestBeach.fishSpecies.map(f => f.name).join(', ')}</p>`;
            }
            
            if (nearestFishingSpot) {
                infoHTML += `<p><strong>Nearest Fishing Spot:</strong> ${nearestFishingSpot.name} (${minFishingDistance.toFixed(1)} km away)</p>`;
                infoHTML += `<p>Target species: ${nearestFishingSpot.fishSpecies.map(f => f.name).join(', ')}</p>`;
            }
            
            document.getElementById('location-info').innerHTML = infoHTML;
        }
        
        // Haversine formula to calculate distance between two coordinates in km
        function calculateDistance(coord1, coord2) {
            const [lon1, lat1] = coord1;
            const [lon2, lat2] = coord2;
            const R = 6371; // Earth's radius in km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = 
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
        }
    
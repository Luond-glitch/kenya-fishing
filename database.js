   document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const resetBtn = document.getElementById('reset-btn');
    const regionFilter = document.getElementById('region-filter');
    const familyFilter = document.getElementById('family-filter');
    const fishGrid = document.getElementById('fish-grid');
    const resultsTitle = document.getElementById('results-title');
    const paginationInfo = document.getElementById('pagination-info');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageNumbers = document.getElementById('page-numbers');
    const fishModal = document.getElementById('fish-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.querySelector('.close-modal');

    // Global variables
    let allFishData = [];
    let filteredFishData = [];
    let currentPage = 1;
    const fishPerPage = 12;
    let fishFamilies = new Set();
    let isLoading = false;

    // Initialize the app
    init();

    // Event listeners
    searchBtn.addEventListener('click', performSearch);
    resetBtn.addEventListener('click', resetSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });
    regionFilter.addEventListener('change', filterFish);
    familyFilter.addEventListener('change', filterFish);
    prevPageBtn.addEventListener('click', goToPrevPage);
    nextPageBtn.addEventListener('click', goToNextPage);
    closeModal.addEventListener('click', () => fishModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === fishModal) fishModal.style.display = 'none';
    });

    // Functions
    async function init() {
        isLoading = true;
        updateLoadingState();
        
        try {
            // Fetch fish data from FishBase API
            const response = await fetch('https://fishbase.ropensci.org/species');
            const data = await response.json();
            
            if (data && data.data) {
                allFishData = data.data.map(fish => ({
                    id: fish.SpecCode,
                    commonName: fish.Species || 'Unknown',
                    scientificName: fish.Genus ? `${fish.Genus} ${fish.Species}` : 'Unknown',
                    family: fish.Family || 'Unknown',
                    genus: fish.Genus || 'Unknown',
                    image: `https://www.fishbase.se/images/species/${fish.SpecCode}.jpg`,
                    description: fish.Comments || 'No description available.',
                    habitat: fish.Habitat || 'Unknown',
                    climate: fish.Climate || 'Unknown',
                    depth: fish.DepthRangeShallow ? 
                          `${fish.DepthRangeShallow}m - ${fish.DepthRangeDeep}m` : 'Unknown',
                    length: fish.Length || 'Unknown',
                    weight: fish.Weight || 'Unknown',
                    region: getRandomRegion() // Since the API doesn't provide region, we'll simulate it
                }));
                
                // Extract unique families for filter
                allFishData.forEach(fish => fishFamilies.add(fish.family));
                populateFamilyFilter();
                
                filteredFishData = [...allFishData];
                displayFish();
            }
        } catch (error) {
            console.error('Error fetching fish data:', error);
            fishGrid.innerHTML = '<div class="error">Failed to load fish data. Please try again later.</div>';
        } finally {
            isLoading = false;
            updateLoadingState();
        }
    }

    function getRandomRegion() {
        const regions = [
            'Atlantic', 'Pacific', 'Indian', 'Arctic', 
            'Mediterranean', 'Caribbean', 'freshwater'
        ];
        return regions[Math.floor(Math.random() * regions.length)];
    }

    function populateFamilyFilter() {
        const sortedFamilies = Array.from(fishFamilies).sort();
        familyFilter.innerHTML = '<option value="">All Families</option>';
        sortedFamilies.forEach(family => {
            familyFilter.innerHTML += `<option value="${family}">${family}</option>`;
        });
    }

    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        currentPage = 1;
        
        if (searchTerm === '') {
            filteredFishData = [...allFishData];
        } else {
            filteredFishData = allFishData.filter(fish => 
                fish.commonName.toLowerCase().includes(searchTerm) ||
                fish.scientificName.toLowerCase().includes(searchTerm) ||
                fish.family.toLowerCase().includes(searchTerm)
            );
        }
        
        filterFish();
    }

    function filterFish() {
        const region = regionFilter.value;
        const family = familyFilter.value;
        
        let results = [...filteredFishData];
        
        if (region) {
            results = results.filter(fish => fish.region === region);
        }
        
        if (family) {
            results = results.filter(fish => fish.family === family);
        }
        
        filteredFishData = results;
        displayFish();
    }

    function resetSearch() {
        searchInput.value = '';
        regionFilter.value = '';
        familyFilter.value = '';
        currentPage = 1;
        filteredFishData = [...allFishData];
        displayFish();
    }

    function displayFish() {
        const startIdx = (currentPage - 1) * fishPerPage;
        const endIdx = startIdx + fishPerPage;
        const fishToDisplay = filteredFishData.slice(startIdx, endIdx);
        
        // Update results title
        if (searchInput.value.trim() !== '' || regionFilter.value !== '' || familyFilter.value !== '') {
            resultsTitle.textContent = `Search Results (${filteredFishData.length} species found)`;
        } else {
            resultsTitle.textContent = 'Featured Fish Species';
        }
        
        // Update pagination info
        paginationInfo.textContent = `Showing ${startIdx + 1}-${Math.min(endIdx, filteredFishData.length)} of ${filteredFishData.length} species`;
        
        // Clear previous results
        fishGrid.innerHTML = '';
        
        if (fishToDisplay.length === 0) {
            fishGrid.innerHTML = '<div class="no-results">No fish species found matching your criteria.</div>';
            updatePaginationControls();
            return;
        }
        
        // Display fish cards
        fishToDisplay.forEach(fish => {
            const fishCard = document.createElement('div');
            fishCard.className = 'fish-card';
            fishCard.innerHTML = `
                <img src="${fish.image}" alt="${fish.commonName}" class="fish-image" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image+Available'">
                <div class="fish-info">
                    <h3>${fish.commonName}</h3>
                    <p class="scientific">${fish.scientificName}</p>
                    <p><strong>Family:</strong> ${fish.family}</p>
                    <p><strong>Region:</strong> ${fish.region}</p>
                </div>
            `;
            
            fishCard.addEventListener('click', () => showFishDetails(fish));
            fishGrid.appendChild(fishCard);
        });
        
        updatePaginationControls();
    }

    function updatePaginationControls() {
        const totalPages = Math.ceil(filteredFishData.length / fishPerPage);
        
        // Previous button
        prevPageBtn.disabled = currentPage === 1;
        
        // Next button
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
        
        // Page numbers
        pageNumbers.innerHTML = '';
        
        // Always show first page
        addPageNumber(1);
        
        // Show ellipsis if needed before current page
        if (currentPage > 3) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            pageNumbers.appendChild(ellipsis);
        }
        
        // Show current page and adjacent pages
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            addPageNumber(i);
        }
        
        // Show ellipsis if needed after current page
        if (currentPage < totalPages - 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            pageNumbers.appendChild(ellipsis);
        }
        
        // Always show last page if there's more than one page
        if (totalPages > 1) {
            addPageNumber(totalPages);
        }
    }

    function addPageNumber(page) {
        const pageElement = document.createElement('span');
        pageElement.className = `page-number ${page === currentPage ? 'active' : ''}`;
        pageElement.textContent = page;
        pageElement.addEventListener('click', () => {
            currentPage = page;
            displayFish();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        pageNumbers.appendChild(pageElement);
    }

    function goToPrevPage() {
        if (currentPage > 1) {
            currentPage--;
            displayFish();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function goToNextPage() {
        const totalPages = Math.ceil(filteredFishData.length / fishPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayFish();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function showFishDetails(fish) {
        modalBody.innerHTML = `
            <div class="modal-header">
                <h2>${fish.commonName}</h2>
                <p class="scientific">${fish.scientificName}</p>
            </div>
            <img src="${fish.image}" alt="${fish.commonName}" onerror="this.src='https://via.placeholder.com/800x400?text=No+Image+Available'">
            
            <div class="modal-details">
                <div>
                    <h4>Family</h4>
                    <p>${fish.family}</p>
                </div>
                <div>
                    <h4>Genus</h4>
                    <p>${fish.genus}</p>
                </div>
                <div>
                    <h4>Region</h4>
                    <p>${fish.region}</p>
                </div>
                <div>
                    <h4>Habitat</h4>
                    <p>${fish.habitat}</p>
                </div>
                <div>
                    <h4>Climate</h4>
                    <p>${fish.climate}</p>
                </div>
                <div>
                    <h4>Depth Range</h4>
                    <p>${fish.depth}</p>
                </div>
                <div>
                    <h4>Length</h4>
                    <p>${fish.length}</p>
                </div>
                <div>
                    <h4>Weight</h4>
                    <p>${fish.weight}</p>
                </div>
            </div>
            
            <div class="modal-description">
                <h4>Description</h4>
                <p>${fish.description}</p>
            </div>
        `;
        
        fishModal.style.display = 'block';
    }

    function updateLoadingState() {
        if (isLoading) {
            fishGrid.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading fish data...</div>';
            searchBtn.disabled = true;
            resetBtn.disabled = true;
        } else {
            searchBtn.disabled = false;
            resetBtn.disabled = false;
        }
    }
});

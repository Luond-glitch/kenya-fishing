import requests 
import random
import json
response = requests.get("https://fishbase.ropensci.org/fishbase")

class FishBaseSearcher:
    def __init__(self):
        self.base_url = "http://fishbase.ropensci.org/fishbase"
        
    def get_random_fish_species(self):
        """Get a list of all fish species and select one randomly"""
        try:
            response = requests.get(f"{self.base_url}/species")
            response.raise_for_status()
            species_list = response.json()
            return random.choice(species_list)
        except requests.exceptions.RequestException as e:
            print(f"Error fetching species list: {e}")
            return None
    
    def get_fish_data(self, species_id=None):
        """Get data for a specific fish species or a random one if none specified"""
        if species_id is None:
            species = self.get_random_fish_species()
            if not species:
                return None
            species_id = species['SpecCode']
        
        try:
            # Get basic species info
            species_url = f"{self.base_url}/species/{species_id}"
            species_response = requests.get(species_url)
            species_response.raise_for_status()
            species_data = species_response.json()
            
            # Get additional data (ecology, diet, etc.)
            ecology_url = f"{self.base_url}/ecology/{species_id}"
            ecology_response = requests.get(ecology_url)
            ecology_data = ecology_response.json() if ecology_response.status_code == 200 else {}
            
            # Combine all data
            combined_data = {
                "species_info": species_data,
                "ecology": ecology_data
            }
            
            return combined_data
        except requests.exceptions.RequestException as e:
            print(f"Error fetching fish data: {e}")
            return None
    
    def pretty_print_fish_data(self, fish_data):
        """Format and display the fish data in a readable way"""
        if not fish_data:
            print("No fish data available.")
            return
        
        species = fish_data['species_info']
        ecology = fish_data.get('ecology', {})
        
        print("\n=== Fish Information ===")
        print(f"Scientific Name: {species.get('Genus', 'Unknown')} {species.get('Species', 'Unknown')}")
        print(f"Common Name: {species.get('FBname', 'Unknown')}")
        print(f"Family: {species.get('Family', 'Unknown')}")
        print(f"Environment: {species.get('Env', 'Unknown')}")
        print(f"Climate: {species.get('Climate', 'Unknown')}")
        print(f"Distribution: {species.get('Distribution', 'Unknown')}")
        
        if ecology:
            print("\n=== Ecology ===")
            print(f"Diet: {ecology.get('DietTroph', 'Unknown')}")
            print(f"Diet Items: {ecology.get('DietFoodI', 'Unknown')}")
            print(f"Food Items: {ecology.get('FoodI', 'Unknown')}")
            print(f"Food Consumption: {ecology.get('FoodConsQ', 'Unknown')}")
        
        print("\n=== Additional Info ===")
        print(f"FishBase URL: https://www.fishbase.se/summary/{species.get('SpecCode', '')}")

def main():
    print("FishBase Random Search Tool")
    print("Fetching a random fish species...\n")
    
    searcher = FishBaseSearcher()
    
    while True:
        # Get random fish data
        fish_data = searcher.get_fish_data()
        
        if fish_data:
            searcher.pretty_print_fish_data(fish_data)
        else:
            print("Failed to retrieve fish data.")
        
        # Ask if user wants to search again
        user_input = input("\nPress Enter to search for another random fish or 'q' to quit: ")
        if user_input.lower() == 'q':
            break

if __name__ == "__main__":
    main()
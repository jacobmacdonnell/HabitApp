import WidgetKit
import SwiftUI

// Data Model matching JS object
struct PetData: Codable {
    let name: String
    let xp: number? // Wait, Swift uses Double/Int
    // JS numbers are Doubles usually, but let's assume Int for XP/Level
    // Wait, let's use Decodable safely.
    let level: Int
    let mood: String
    let hat: String?
    let color: String
    let health: Double
    // XP might be passed as number
    let xp: Int
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), pet: PetData(name: "Buddy", level: 1, mood: "happy", hat: nil, color: "#4ade80", health: 100, xp: 0))
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), pet: loadPetData())
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        var entries: [SimpleEntry] = []
        let currentDate = Date()
        
        // Refresh every 15 minutes
        let nextUpdateDate = Calendar.current.date(byAdding: .minute, value: 15, to: currentDate)!
        
        let pet = loadPetData()
        let entry = SimpleEntry(date: currentDate, pet: pet)
        entries.append(entry)

        let timeline = Timeline(entries: entries, policy: .after(nextUpdateDate))
        completion(timeline)
    }
    
    func loadPetData() -> PetData? {
        // App Group ID must match apps/mobile/app.json
        let userDefaults = UserDefaults(suiteName: "group.com.habitapp.cyb3rmac")
        
        if let jsonString = userDefaults?.string(forKey: "pet_data"),
           let data = jsonString.data(using: .utf8) {
            do {
                let pet = try JSONDecoder().decode(PetData.self, from: data)
                return pet
            } catch {
                print("Error decoding pet data: \(error)")
            }
        }
        return nil
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let pet: PetData?
}

struct HabitWidgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
        ZStack {
            // Background
            Color("WidgetBackground") // Define this in Assets or use literal
            
            if let pet = entry.pet {
                VStack {
                    Text(pet.name)
                        .font(.custom("System", size: 16))
                        .bold()
                        .foregroundColor(.white)
                    
                    Text("Lvl \(pet.level)")
                        .font(.caption)
                        .foregroundColor(.gray)
                    
                    // Simple mood indicator
                    Text(pet.mood == "happy" ? "😊" : "😴")
                        .font(.largeTitle)
                }
            } else {
                Text("Open App to Sync")
                    .foregroundColor(.gray)
            }
        }
    }
}

@main
struct HabitWidget: Widget {
    let kind: String = "HabitWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            HabitWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Pet Status")
        .description("Keep track of your companion.")
        .supportedFamilies([.systemSmall])
    }
}

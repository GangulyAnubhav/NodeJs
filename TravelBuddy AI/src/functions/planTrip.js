import { app } from "@azure/functions";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

app.http('planTrip', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {        
        try {
            if (!genAI) {
                context.log("GEMINI_API_KEY is missing.");
                return { status: 500, body: "Server Error: API Key missing." };
            }

            const reqBody = await request.json();
            const { destination, days, style, specialRequest } = reqBody; // Assuming structured input
            context.log(`Received request: Destination=${destination}, Days=${days}, Style=${style}`);

            if (!destination) {
                return { status: 400, body: "Destination is required." };
            }

            // Generative Model Initialization
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash-lite", 
                systemInstruction: "You are a travel API. Return ONLY valid JSON. No conversational text, no markdown backticks.",
            });

            // 4. Structuring Prompt Building
            const prompt = `
                Generate a detailed ${days}-day itinerary for a "${style}" trip to ${destination}.

                Trip Requirements:
                - The entire itinerary must strictly follow the "${style}" vibe.
                - Include places mentioned in this special request: "${specialRequest}".
                - Ensure the special request locations are properly distributed across the itinerary.
                - Suggest travel modes and budget strategy according to the trip style.

                Return response ONLY in valid JSON format (no extra text):

                {
                "tripTitle": "string",
                "destination": "${destination}",
                "totalDays": ${days},
                "styleApplied": "${style}",

                "budgetSummary": {
                    "estimatedBudgetLevel": "Low | Moderate | Luxury",
                    "costManagementTips": ["Tip 1", "Tip 2"],
                    "averageDailyEstimatedCost": "Approximate cost per person per day in local currency"
                },

                "recommendedTransport": {
                    "localTransportModes": ["Metro", "Public Transport", "Private Cab"],
                    "airportTransfers": "Suggested airport transfer option",
                    "intercityTravelIfAny": "Details if applicable"
                },

                "hotelSuggestions": [
                    {
                    "name": "Hotel Name",
                    "category": "Budget | Mid-range | Luxury",
                    "reason": "Why this hotel matches the trip style"
                    }
                ],

                "itinerary": [
                    {
                    "day": 1,
                    "theme": "Short theme for the day based on style",
                    "activities": [
                        {
                        "timeOfDay": "Morning | Afternoon | Evening",
                        "title": "Activity name",
                        "description": "1–2 sentence description matching the trip style",
                        "estimatedCost": "Approximate cost or Free",
                        "transportSuggestion": "How to reach this place"
                        }
                    ]
                    }
                ]
                }
            `;

            const result = await model.generateContent(prompt);
            const text = result.response.text();

            // 5. Clean & Parse JSON
            const cleanJson = text.replace(/```json|```/g, "").trim();
            const travelData = JSON.parse(cleanJson);

            return {
                status: 200,
                jsonBody: {
                    success: true,
                    data: travelData
                },
            };

        } catch (error) {
            context.log("Error in planTrip:", error);
            
            // Handle Quota Error specifically
            if (error.status === 429) {
                return {
                    status: 429,
                    jsonBody: { error: "Quota exceeded. Please try again in a few minutes." }
                };
            }

            return {
                status: 500,
                jsonBody: { error: "Failed to generate travel plan." },
            };
        }
    },
});
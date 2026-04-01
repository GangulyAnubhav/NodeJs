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
                Create a ${days}-day travel itinerary for a "${style}" trip to ${destination}.

                Requirements:
                - Follow the "${style}" travel style.
                - Include places from this special request: "${specialRequest}".
                - Distribute those places across the itinerary.
                - Suggest transport options and budget-friendly tips based on the style.

                Return ONLY valid JSON in this format:

                {
                "tripTitle": "string",
                "destination": "${destination}",
                "totalDays": ${days},
                "styleApplied": "${style}",

                "budgetSummary": {
                    "estimatedBudgetLevel": "Low | Moderate | Luxury",
                    "costManagementTips": ["Tip 1", "Tip 2"],
                    "averageDailyEstimatedCost": "Cost per person per day"
                },

                "recommendedTransport": {
                    "localTransportModes": ["Transport 1", "Transport 2"],
                    "airportTransfers": "Airport transfer suggestion",
                    "intercityTravelIfAny": "Details if applicable"
                },

                "hotelSuggestions": [
                    {
                    "name": "Hotel Name",
                    "category": "Budget | Mid-range | Luxury",
                    "reason": "Why it matches the trip style"
                    }
                ],

                "itinerary": [
                    {
                        "day": 1,
                        "theme": "Short theme for the day",
                        "activities": [
                            {
                                "timeOfDay": "Morning | Afternoon | Evening",
                                "title": "Activity name",
                                "description": "Short description",
                                "estimatedCost": "Cost or Free",
                                "transportSuggestion": "How to reach"
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
            // console.log(JSON.stringify(travelData.itinerary[0].activities, null, 2));

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
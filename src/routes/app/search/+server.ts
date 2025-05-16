import { json } from '@sveltejs/kit';
import { GOOGLE_GEMINI_API_KEY } from '$env/static/private';
import { getTreeSpeciesCollection } from '$lib/server/db/colTrees';
import { ObjectId } from 'mongodb';

export async function GET({ url }) {
	const speciesId = url.searchParams.get('speciesId');
	let speciesName = "trees";

	if (speciesId) {
		try {
			const speciesCol = await getTreeSpeciesCollection();
			const speciesDoc = await speciesCol.findOne({ _id: new ObjectId(speciesId) });
			if (speciesDoc?.commonName) {
				speciesName = speciesDoc.commonName;
			}
		} catch (err) {
			console.error("Species lookup failed:", err);
		}
	}

	const prompt = `Give me a short, fun eco fact or tree tip about ${speciesName}. Keep it under 2 sentences.`;

	try {
		const res = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_GEMINI_API_KEY}`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					contents: [{ parts: [{ text: prompt }] }]
				})
			}
		);

		const data = await res.json();
		console.log("Gemini response:", JSON.stringify(data, null, 2));

		let fact = "🌱 Nature is full of surprises. Try again later!";
		if (data?.candidates?.length > 0) {
			const candidate = data.candidates[0];
			if (candidate?.content?.parts?.length > 0) {
				fact = candidate.content.parts[0].text ?? fact;
			}
		}

		return json({ fact });

	} catch (error) {
		console.error("Gemini API error:", error);
		return json({ fact: "🌧️ Oops! AI couldn't generate a fact right now. Try again later." });
	}
}

import type {IPrice, PriceType} from "../@types/price";


export const pricesData: { prices: IPrice[] } = {
    "prices": [
        {
            "id": 1,
            "label": "Accès illimité à toutes les attractions pour 1 journée complète",
            "type": "ADULTE" as PriceType,
            "amount": 29.9,
            "duration_days": 1,
            "created_at": new Date("2024-03-15T10:30:00Z"),
            "updated_at": new Date("2024-03-15T10:30:00Z")
        },
        {
            "id": 2,
            "label": "Tarif réduit sur présentation de carte étudiante valide",
            "type": "ETUDIANT" as PriceType,
            "amount": 24.9,
            "duration_days": 1,
            "created_at": new Date("2024-03-15T10:30:00Z"),
            "updated_at": new Date("2024-03-15T10:30:00Z")
        },
        {
            "id": 3,
            "label": "A partir de 10 personnes, prix unitaire avantageux",
            "type": "GROUPE" as PriceType,
            "amount": 22.9,
            "duration_days": 1,
            "created_at": new Date("2024-03-15T10:30:00Z"),
            "updated_at": new Date("2024-03-15T10:30:00Z")
        },
        {
            "id": 4,
            "label": "Valable 2 jours consécutifs, toutes attractions incluses",
            "type": "PASS_2J" as PriceType,
            "amount": 49.9,
            "duration_days": 2,
            "created_at": new Date("2024-03-15T10:30:00Z"),
            "updated_at": new Date("2024-03-15T10:30:00Z")
        }
    ]
}
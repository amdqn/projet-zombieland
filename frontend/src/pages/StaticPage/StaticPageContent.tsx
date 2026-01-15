// data/staticPagesContent.tsx
import { Typography, Box, Link } from "@mui/material";
import type {JSX} from "react";
import {colors} from "../../theme";

interface StaticPageData {
    title: string;
    content: JSX.Element;
    lastUpdate: string;
}

interface StaticPagesContent {
    [key: string]: StaticPageData;
}

function handleOpenCookieSettings() {
    localStorage.removeItem('cookieConsent');
    window.location.reload();
}

export const staticPagesContent: StaticPagesContent = {
    "gestion-cookies": {
        title: "Gestion des Cookies",
        lastUpdate: "15 janvier 2026",
        content: (
            <>
                <Typography variant="h3" color={colors.primaryGreen}>1. Qu'est-ce qu'un cookie ?</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone)
                    lors de la visite d'un site internet. Il permet de mémoriser des informations relatives à votre
                    navigation.
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>2. Les cookies utilisés sur ZombieLand</Typography>

                <Typography variant="h5" pt={2}>2.1. Cookies essentiels</Typography>
                <Typography sx={{pt: 3}}>
                    Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés :
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>Cookies de session pour maintenir votre connexion</li>
                    <li>Cookies de sécurité pour protéger vos données</li>
                    <li>Cookies de préférences (langue, devise)</li>
                </Box>

                <Typography variant="h5" >2.2. Cookies analytiques</Typography>
                <Typography sx={{pt: 3}}>
                    Ces cookies nous permettent d'analyser l'utilisation du site (Google Analytics, etc.) :
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>Nombre de visiteurs</li>
                    <li>Pages les plus consultées</li>
                    <li>Durée de visite</li>
                </Box>

                <Typography variant="h3" color={colors.primaryGreen}>2.3. Cookies publicitaires</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    Ces cookies permettent d'afficher des publicités personnalisées selon vos centres d'intérêt.
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>3. Gérer vos préférences</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    Vous pouvez à tout moment modifier vos préférences en matière de cookies via les paramètres
                    de votre navigateur ou en cliquant sur le lien "Gérer les cookies" en bas de page.
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>4. Durée de conservation</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    Les cookies sont conservés pour une durée maximale de 13 mois à compter de leur dépôt sur
                    votre terminal.
                </Typography>
                <Link onClick={handleOpenCookieSettings} sx={{ cursor: 'pointer' }}>
                    Supprimer les cookies
                </Link>
            </>
        )
    },
    "mentions-legales": {
        title: "Mentions Légales",
        lastUpdate: "15 janvier 2026",
        content: (
            <>
                <Typography variant="h3" color={colors.primaryGreen}>1. Éditeur du site</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    <strong>ZombieLand SAS</strong><br />
                    Parc d'attractions post-apocalyptique<br />
                    Siège social : [Adresse complète]<br />
                    Capital social : [Montant]€<br />
                    RCS : Paris 75000<br />
                    SIRET : 123 456 789 00012<br />
                    TVA intracommunautaire : FR 12 123456789<br />
                    Téléphone : 06.66.66.66.66<br />
                    Email : contact@zombieland.com
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>2. Directeur de la publication</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    Victor Deadwood<br />
                    Email : direction@zombieland.com
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>3. Hébergeur</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    [Nom de l'hébergeur]<br />
                    [Adresse de l'hébergeur]<br />
                    Téléphone : [Numéro]
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>4. Propriété intellectuelle</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    L'ensemble du contenu de ce site (textes, images, vidéos, logos, concept du parc) est protégé
                    par le droit d'auteur et le droit des marques. La marque ZombieLand ainsi que tous les éléments
                    visuels et scénarios du parc sont la propriété exclusive de ZombieLand SAS. Toute reproduction,
                    même partielle, est interdite sans autorisation préalable.
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>5. Crédits</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    Conception et développement : Equipe Zombieland O'Clock<br />
                    Photographies : Equipe Zombieland O'Clock<br />
                    Design du parc : Equipe Zombieland O'Clock
                </Typography>
            </>
        )
    },

    "rgpd": {
        title: "Politique de Confidentialité (RGPD)",
        lastUpdate: "15 janvier 2026",
        content: (
            <>
                <Typography variant="h3" color={colors.primaryGreen}>1. Responsable du traitement</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    Le responsable du traitement des données personnelles est :<br />
                    <strong>ZombieLand SAS</strong><br />
                    Parc d'attractions post-apocalyptique<br />
                    Email : service-client@zombieland.fr
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>2. Données collectées</Typography>
                <Typography sx={{pt: 3}}>
                    Nous collectons uniquement les données nécessaires à votre réservation de billets :
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li><strong>Données d'identité :</strong> nom, prénom</li>
                    <li><strong>Données de contact :</strong> email, téléphone</li>
                    <li><strong>Données de réservation :</strong> date de visite, nombre de billets, type de billet</li>
                    <li><strong>Données de paiement :</strong> informations bancaires</li>
                    <li><strong>Données de connexion :</strong> adresse IP, cookies de navigation</li>
                </Box>

                <Typography variant="h3" color={colors.primaryGreen}>3. Finalités du traitement</Typography>
                <Typography sx={{pt: 3}}>
                    Vos données sont traitées uniquement pour :
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>La gestion de vos réservations de billets</li>
                    <li>Le traitement sécurisé de vos paiements</li>
                    <li>L'envoi de votre confirmation de réservation et billets électroniques</li>
                    <li>La communication d'informations importantes concernant votre visite (horaires, consignes de sécurité)</li>
                    <li>L'amélioration de nos services et de votre expérience au parc</li>
                    <li>Le respect de nos obligations légales</li>
                </Box>

                <Typography variant="h3" color={colors.primaryGreen}>4. Base légale</Typography>
                <Typography sx={{pt: 3}}>
                    Le traitement de vos données repose sur :
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>L'exécution du contrat de réservation de billets</li>
                    <li>Votre consentement pour les cookies non essentiels</li>
                    <li>Notre intérêt légitime (sécurité du parc, amélioration des services)</li>
                    <li>Nos obligations légales (comptabilité, facturation)</li>
                </Box>

                <Typography variant="h3" color={colors.primaryGreen}>5. Durée de conservation</Typography>
                <Typography sx={{pt: 3}}>
                    Vos données sont conservées :
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>Données de réservation : 10 ans (obligations comptables et fiscales)</li>
                    <li>Données de paiement : immédiatement supprimées après transaction</li>
                    <li>Données de navigation : 13 mois maximum</li>
                </Box>

                <Typography variant="h3" color={colors.primaryGreen}>6. Vos droits</Typography>
                <Typography sx={{pt: 3}}>
                    Conformément au RGPD, vous disposez des droits suivants :
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li><strong>Droit d'accès :</strong> obtenir une copie de vos données de réservation</li>
                    <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
                    <li><strong>Droit à l'effacement :</strong> supprimer vos données (sauf obligations légales)</li>
                    <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
                    <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format structuré</li>
                    <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
                    <li><strong>Droit de retirer votre consentement :</strong> à tout moment pour les cookies</li>
                </Box>

                <Typography sx={{pt: 3, pb: 3}}>
                    Pour exercer vos droits, contactez-nous à : <Link href="mailto:service-client@zombieland.fr">service-client@zombieland.fr</Link>
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>7. Sécurité des données</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour
                    protéger vos données contre tout accès non autorisé, perte ou destruction. Vos données
                    bancaires sont traitées par notre prestataire de paiement sécurisé certifié PCI-DSS et
                    ne sont jamais stockées sur nos serveurs.
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>8. Partage des données</Typography>
                <Typography sx={{pt: 3}}>
                    Vos données personnelles ne sont jamais vendues à des tiers. Elles sont uniquement partagées avec :
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>Notre prestataire de paiement sécurisé (pour le traitement des transactions)</li>
                    <li>Notre service d'envoi d'emails (pour l'envoi de vos billets électroniques)</li>
                    <li>Les autorités compétentes en cas d'obligation légale</li>
                </Box>

                <Typography variant="h3" color={colors.primaryGreen}>9. Réclamation</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    Vous avez le droit d'introduire une réclamation auprès de la CNIL :<br />
                    Commission Nationale de l'Informatique et des Libertés<br />
                    3 Place de Fontenoy - TSA 80715<br />
                    75334 PARIS CEDEX 07<br />
                    Tél : 01 53 73 22 22<br />
                    <Link href="https://www.cnil.fr" target="_blank" rel="noopener">www.cnil.fr</Link>
                </Typography>
            </>
        )
    },

    "cgu": {
        title: "Conditions Générales d'Utilisation (CGU)",
        lastUpdate: "15 janvier 2026",
        content: (
            <>
                <Typography variant="h3" color={colors.primaryGreen}>1. Objet</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation du site
                    www.zombieland.fr, plateforme de réservation de billets pour le parc d'attractions post-apocalyptique
                    ZombieLand.
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>2. Acceptation des CGU</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    L'utilisation du site implique l'acceptation pleine et entière des présentes CGU.
                    La réservation de billets implique également l'acceptation du règlement intérieur du parc.
                    Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le site.
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>3. Accès au site</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    Le site est accessible gratuitement à tout utilisateur disposant d'un accès internet.
                    ZombieLand se réserve le droit de suspendre, modifier ou interrompre l'accès au site
                    pour maintenance ou toute autre raison, sans préavis. L'accès peut également être limité
                    en cas d'affluence exceptionnelle ou de circonstances particulières.
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>4. Services proposés</Typography>
                <Typography sx={{pt: 3}}>
                    Le site permet uniquement :
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>La consultation des informations sur le parc (attractions, horaires, tarifs)</li>
                    <li>La réservation et l'achat de billets d'entrée en ligne</li>
                    <li>La consultation de votre historique de réservations</li>
                    <li>L'accès aux informations pratiques (plan du parc, règlement, consignes de sécurité)</li>
                </Box>

                <Typography variant="h3" color={colors.primaryGreen}>5. Utilisation du site</Typography>
                <Typography sx={{pt: 3}}>
                    Vous vous engagez à :
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>Utiliser le site de manière conforme à la loi et aux présentes CGU</li>
                    <li>Fournir des informations exactes lors de vos réservations</li>
                    <li>Ne pas perturber le fonctionnement du site</li>
                    <li>Ne pas utiliser de robots ou systèmes automatisés pour réserver des billets</li>
                    <li>Ne pas revendre vos billets à un prix supérieur au tarif officiel</li>
                    <li>Respecter le règlement intérieur du parc lors de votre visite</li>
                </Box>

                <Typography variant="h3" color={colors.primaryGreen}>6. Propriété intellectuelle</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    Tous les contenus du site (textes, images, logos, vidéos, concept du parc, scénarios des attractions)
                    sont protégés par le droit de la propriété intellectuelle. La marque "ZombieLand" et l'ensemble de
                    l'univers post-apocalyptique sont la propriété exclusive de ZombieLand SAS. Toute reproduction,
                    représentation ou utilisation est interdite sans autorisation préalable écrite.
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>7. Responsabilité</Typography>
                <Typography sx={{pt: 3}}>
                    ZombieLand ne peut être tenu responsable :
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>Des interruptions ou dysfonctionnements temporaires du site de réservation</li>
                    <li>De l'impossibilité d'accéder au site en raison de problèmes techniques</li>
                    <li>Des erreurs de réservation résultant d'informations incorrectes fournies par l'utilisateur</li>
                    <li>De la perte ou du vol de billets électroniques (il est conseillé de les conserver en lieu sûr)</li>
                    <li>Des contenus des sites tiers vers lesquels nous renvoyons</li>
                </Box>

                <Typography sx={{pb: 3}}>
                    La responsabilité de ZombieLand concernant les incidents au sein du parc est régie par
                    le règlement intérieur et les CGV.
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>8. Disponibilité des billets</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    Les billets sont disponibles dans la limite des places disponibles. ZombieLand se réserve
                    le droit de limiter le nombre de visiteurs par jour pour des raisons de sécurité et de confort.
                    Les tarifs et disponibilités affichés sur le site sont susceptibles de changer sans préavis.
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>9. Modification des CGU</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    ZombieLand se réserve le droit de modifier les présentes CGU à tout moment.
                    Les nouvelles CGU seront applicables dès leur mise en ligne sur le site. Il est conseillé
                    de consulter régulièrement cette page.
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>10. Droit applicable</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    Les présentes CGU sont soumises au droit français. Tout litige sera porté devant
                    les tribunaux compétents.
                </Typography>
            </>
        )
    },

    "cgv": {
        title: "Conditions Générales de Vente (CGV)",
        lastUpdate: "15 janvier 2026",
        content: (
            <>
                <Typography variant="h3" color={colors.primaryGreen}>1. Objet</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    Les présentes Conditions Générales de Vente (CGV) s'appliquent à toutes les réservations
                    et achats de billets d'entrée pour le parc d'attractions ZombieLand effectués sur le site
                    www.zombieland.fr.
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>2. Billets proposés</Typography>
                <Typography sx={{pt: 3}}>
                    ZombieLand propose différents types de billets :
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li><strong>Billet 1 jour :</strong> accès au parc pour une journée</li>
                    <li><strong>Billet 2 jours consécutifs :</strong> accès au parc pendant deux jours consécutifs</li>
                    <li><strong>Pass annuel :</strong> accès illimité au parc pendant un an</li>
                    <li><strong>Billets groupes :</strong> tarifs préférentiels pour les groupes (à partir de 10 personnes)</li>
                    <li><strong>Billets événements spéciaux :</strong> accès aux événements nocturnes ou saisonniers</li>
                </Box>

                <Typography variant="h3" color={colors.primaryGreen}>3. Prix</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    Les prix sont indiqués en euros TTC. ZombieLand se réserve le droit de modifier
                    ses tarifs à tout moment, notamment en fonction de la période (haute/basse saison,
                    jours fériés, événements spéciaux). Les billets seront facturés au prix en vigueur
                    au moment de la validation de la commande.
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>4. Réservation de billets</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    La validation de votre réservation implique l'acceptation des présentes CGV et du
                    règlement intérieur du parc. Elle constitue une preuve du contrat de vente.
                </Typography>

                <Typography variant="h5" pt={2}>4.1. Processus de réservation</Typography>
                <Box component="ol" sx={{pt: 3, pb: 3}}>
                    <li>Sélection de la date de visite et du type de billets</li>
                    <li>Indication du nombre de visiteurs</li>
                    <li>Vérification du panier</li>
                    <li>Saisie des informations personnelles (nom, prénom, email, téléphone)</li>
                    <li>Choix du mode de paiement</li>
                    <li>Paiement sécurisé</li>
                    <li>Confirmation et réception des billets électroniques par email</li>
                </Box>

                <Typography variant="h3" color={colors.primaryGreen}>5. Paiement</Typography>
                <Typography sx={{pt: 3}}>
                    Le paiement s'effectue en ligne par :
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>Carte bancaire (Visa, Mastercard, American Express)</li>
                    <li>PayPal</li>
                    <li>Apple Pay / Google Pay</li>
                </Box>
                <Typography sx={{pb: 3}}>
                    Le paiement est entièrement sécurisé via notre prestataire certifié PCI-DSS.
                    ZombieLand ne conserve aucune donnée bancaire. Le paiement est exigible immédiatement
                    lors de la réservation.
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>6. Billets électroniques</Typography>
                <Typography sx={{pt: 3}}>
                    Après confirmation de paiement, vous recevrez par email :
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>Une confirmation de réservation avec le récapitulatif</li>
                    <li>Vos billets électroniques (e-tickets) au format PDF avec QR code</li>
                    <li>Le règlement intérieur du parc</li>
                    <li>Les informations pratiques pour votre visite</li>
                </Box>
                <Typography sx={{pb: 3}}>
                    Les billets peuvent être présentés sur smartphone ou imprimés. Chaque billet comporte
                    un QR code unique qui sera scanné à l'entrée du parc.
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>7. Validité des billets</Typography>
                <Typography sx={{pt: 3}}>
                    Les billets sont valables :
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li><strong>Billet daté :</strong> uniquement pour la date sélectionnée lors de la réservation</li>
                    <li><strong>Billet flexible :</strong> pendant la période de validité indiquée (si disponible)</li>
                    <li><strong>Pass annuel :</strong> pendant un an à compter de la première utilisation</li>
                </Box>
                <Typography sx={{pb: 3}}>
                    Les billets ne sont ni repris, ni échangés, ni remboursés sauf cas exceptionnels
                    prévus par la loi ou les présentes CGV.
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>8. Droit de rétractation</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation
                    de 14 jours ne s'applique pas aux prestations de services de loisirs à date déterminée.
                    Les billets d'entrée au parc ne peuvent donc pas faire l'objet d'une rétractation.
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>9. Modification et annulation</Typography>

                <Typography variant="h5" pt={2}>9.1. Modification par le client</Typography>
                <Typography sx={{pt: 3}}>
                    Vous pouvez modifier votre réservation (changement de date) selon les conditions suivantes :
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li><strong>Plus de 10 jours avant :</strong> modification gratuite (une seule fois, sous réserve de disponibilité)</li>
                    <li><strong>Moins de 10 jours avant :</strong> aucune modification possible</li>
                </Box>

                <Typography variant="h5">9.2. Annulation par le client</Typography>
                <Typography sx={{pt: 3}}>
                    En cas d'annulation de votre part :
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li><strong>Plus de 10 jours avant :</strong> remboursement intégral (frais de traitement de 2€ par billet déduits)</li>
                    <li><strong>Moins de 10 jours avant :</strong> aucun remboursement</li>
                    <li><strong>Non présentation le jour J :</strong> aucun remboursement</li>
                </Box>

                <Typography variant="h5">9.3. Fermeture du parc par ZombieLand</Typography>
                <Typography sx={{pt: 3}}>
                    En cas de fermeture exceptionnelle du parc pour raisons indépendantes de notre volonté
                    (intempéries graves, cas de force majeure, décision administrative), ZombieLand s'engage à :
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>Vous informer dans les plus brefs délais par email et SMS</li>
                    <li>Vous proposer un report de votre visite à une date ultérieure de votre choix</li>
                    <li>Ou procéder au remboursement intégral de vos billets</li>
                </Box>

                <Typography variant="h5">9.4. Fermeture partielle d'attractions</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    ZombieLand se réserve le droit de fermer temporairement certaines attractions pour
                    maintenance, raisons de sécurité ou conditions météorologiques. Ces fermetures partielles
                    ne donnent pas droit à un remboursement ou une compensation, sauf si plus de 50% des
                    attractions sont fermées le jour de votre visite.
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>10. Conditions d'accès au parc</Typography>
                <Typography sx={{pt: 3}}>
                    L'accès au parc est soumis aux conditions suivantes :
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>Présentation obligatoire du billet électronique (QR code)</li>
                    <li>Respect du règlement intérieur du parc</li>
                    <li>Restrictions d'âge et de taille pour certaines attractions</li>
                    <li>Interdiction d'introduire de la nourriture, des boissons alcoolisées et des objets dangereux</li>
                    <li>Port du masque obligatoire dans certaines zones (pour l'ambiance post-apocalyptique)</li>
                    <li>Les visiteurs peuvent être photographiés ou filmés à des fins promotionnelles</li>
                </Box>

                <Typography variant="h3" color={colors.primaryGreen}>11. Sécurité et responsabilité</Typography>
                <Typography sx={{pt: 3}}>
                    ZombieLand met tout en œuvre pour assurer la sécurité des visiteurs. Toutefois,
                    ZombieLand ne peut être tenu responsable :
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>Des accidents survenus en cas de non-respect du règlement intérieur ou des consignes de sécurité</li>
                    <li>Des vols, pertes ou détériorations d'objets personnels (vestiaires non surveillés)</li>
                    <li>Des réactions individuelles aux effets spéciaux (sons forts, lumières stroboscopiques, fumée)</li>
                    <li>Des problèmes de santé liés aux attractions à sensations fortes (déconseillées aux femmes enceintes,
                        personnes cardiaques, etc.)</li>
                </Box>
                <Typography sx={{pb: 3}}>
                    Les visiteurs sont invités à consulter les consignes de sécurité affichées à l'entrée de chaque attraction.
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>12. Restrictions d'âge</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    Le parc ZombieLand propose des expériences post-apocalyptiques avec zombies et scènes effrayantes.
                    Il est déconseillé aux enfants de moins de 12 ans. Les enfants de 12 à 16 ans doivent être
                    accompagnés d'un adulte. Certaines attractions sont interdites aux moins de 16 ans.
                    L'accès peut être refusé si l'âge minimum requis n'est pas respecté, sans remboursement.
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>13. Réclamations</Typography>
                <Typography sx={{pt: 3}}>
                    Pour toute réclamation concernant votre réservation ou votre visite, contactez notre service client :
                </Typography>
                <Typography sx={{pb: 3}}>
                    Email : service-client@zombieland.fr<br />
                    Téléphone : 06.66.66.66.66<br />
                    Horaires : Du mercredi au dimanche de 9h à 18h<br />
                    Courrier : ZombieLand SAS - Service Client - 75000 Paris
                </Typography>
                <Typography sx={{pb: 3}}>
                    Nous nous engageons à répondre à toute réclamation dans un délai de 15 jours ouvrés.
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>14. Médiation de la consommation</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    En cas de litige non résolu à l'amiable, vous pouvez recourir gratuitement à un médiateur de la consommation :<br />
                    <strong>Médiateur du Tourisme et du Voyage</strong><br />
                    BP 80 303 - 75 823 Paris Cedex 17<br />
                    Email : mtv@mtv.travel<br />
                    Site web : www.mtv.travel
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>15. Données personnelles</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    Les données personnelles collectées lors de votre réservation sont traitées conformément
                    à notre Politique de Confidentialité (RGPD) disponible sur le site. Vous disposez d'un
                    droit d'accès, de rectification et de suppression de vos données en contactant service-client@zombieland.fr.
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>16. Droit applicable et juridiction</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    Les présentes CGV sont soumises au droit français. En cas de litige, et après tentative
                    de résolution amiable, les tribunaux français seront seuls compétents.
                </Typography>
            </>
        )
    }
};
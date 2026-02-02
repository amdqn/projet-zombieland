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

type TranslationFunction = (key: string) => string;

function handleOpenCookieSettings() {
    localStorage.removeItem('cookieConsent');
    window.location.reload();
}

export const getStaticPagesContent = (t: TranslationFunction): StaticPagesContent => ({
    "gestion-cookies": {
        title: t("static.cookies.title"),
        lastUpdate: t("static.cookies.lastUpdate"),
        content: (
            <>
                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cookies.whatIsCookie")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.cookies.whatIsCookieDesc")}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cookies.cookiesUsed")}</Typography>

                <Typography variant="h5" pt={2}>{t("static.cookies.essentialCookies")}</Typography>
                <Typography sx={{pt: 3}}>
                    {t("static.cookies.essentialCookiesDesc")}
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>{t("static.cookies.sessionCookies")}</li>
                    <li>{t("static.cookies.securityCookies")}</li>
                    <li>{t("static.cookies.preferenceCookies")}</li>
                </Box>

                <Typography variant="h5" >{t("static.cookies.analyticalCookies")}</Typography>
                <Typography sx={{pt: 3}}>
                    {t("static.cookies.analyticalCookiesDesc")}
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>{t("static.cookies.visitorCount")}</li>
                    <li>{t("static.cookies.popularPages")}</li>
                    <li>{t("static.cookies.visitDuration")}</li>
                </Box>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cookies.advertisingCookies")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.cookies.advertisingCookiesDesc")}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cookies.managePreferences")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.cookies.managePreferencesDesc")}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cookies.retentionPeriod")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.cookies.retentionPeriodDesc")}
                </Typography>
                <Link onClick={handleOpenCookieSettings} sx={{ cursor: 'pointer' }}>
                    {t("static.cookies.deleteCookies")}
                </Link>
            </>
        )
    },
    "mentions-legales": {
        title: t("static.mentionsLegales.title"),
        lastUpdate: t("static.mentionsLegales.lastUpdate"),
        content: (
            <>
                <Typography variant="h3" color={colors.primaryGreen}>{t("static.mentionsLegales.publisher")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.mentionsLegales.publisherContent").split('\n').map((line, i) => (
                        <span key={i}>{line}<br /></span>
                    ))}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.mentionsLegales.publicationDirector")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.mentionsLegales.publicationDirectorContent").split('\n').map((line, i) => (
                        <span key={i}>{line}<br /></span>
                    ))}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.mentionsLegales.host")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.mentionsLegales.hostContent").split('\n').map((line, i) => (
                        <span key={i}>{line}<br /></span>
                    ))}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.mentionsLegales.intellectualProperty")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.mentionsLegales.intellectualPropertyDesc")}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.mentionsLegales.credits")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.mentionsLegales.creditsContent").split('\n').map((line, i) => (
                        <span key={i}>{line}<br /></span>
                    ))}
                </Typography>
            </>
        )
    },

    "rgpd": {
        title: t("static.rgpd.title"),
        lastUpdate: t("static.rgpd.lastUpdate"),
        content: (
            <>
                <Typography variant="h3" color={colors.primaryGreen}>{t("static.rgpd.dataController")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.rgpd.dataControllerContent").split('\n').map((line, i) => (
                        <span key={i}>{line}<br /></span>
                    ))}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.rgpd.dataCollected")}</Typography>
                <Typography sx={{pt: 3}}>
                    {t("static.rgpd.dataCollectedDesc")}
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li><strong>{t("static.rgpd.identityData")}</strong></li>
                    <li><strong>{t("static.rgpd.contactData")}</strong></li>
                    <li><strong>{t("static.rgpd.bookingData")}</strong></li>
                    <li><strong>{t("static.rgpd.paymentData")}</strong></li>
                    <li><strong>{t("static.rgpd.connectionData")}</strong></li>
                </Box>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.rgpd.processingPurposes")}</Typography>
                <Typography sx={{pt: 3}}>
                    {t("static.rgpd.processingPurposesDesc")}
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>{t("static.rgpd.purpose1")}</li>
                    <li>{t("static.rgpd.purpose2")}</li>
                    <li>{t("static.rgpd.purpose3")}</li>
                    <li>{t("static.rgpd.purpose4")}</li>
                    <li>{t("static.rgpd.purpose5")}</li>
                    <li>{t("static.rgpd.purpose6")}</li>
                </Box>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.rgpd.legalBasis")}</Typography>
                <Typography sx={{pt: 3}}>
                    {t("static.rgpd.legalBasisDesc")}
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>{t("static.rgpd.basis1")}</li>
                    <li>{t("static.rgpd.basis2")}</li>
                    <li>{t("static.rgpd.basis3")}</li>
                    <li>{t("static.rgpd.basis4")}</li>
                </Box>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.rgpd.retentionPeriod")}</Typography>
                <Typography sx={{pt: 3}}>
                    {t("static.rgpd.retentionPeriodDesc")}
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>{t("static.rgpd.retention1")}</li>
                    <li>{t("static.rgpd.retention2")}</li>
                    <li>{t("static.rgpd.retention3")}</li>
                </Box>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.rgpd.rights")}</Typography>
                <Typography sx={{pt: 3}}>
                    {t("static.rgpd.rightsDesc")}
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li><strong>{t("static.rgpd.right1")}</strong></li>
                    <li><strong>{t("static.rgpd.right2")}</strong></li>
                    <li><strong>{t("static.rgpd.right3")}</strong></li>
                    <li><strong>{t("static.rgpd.right4")}</strong></li>
                    <li><strong>{t("static.rgpd.right5")}</strong></li>
                    <li><strong>{t("static.rgpd.right6")}</strong></li>
                    <li><strong>{t("static.rgpd.right7")}</strong></li>
                </Box>

                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.rgpd.rightsContact")} <Link href="mailto:service-client@zombieland.fr">service-client@zombieland.fr</Link>
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.rgpd.dataSecurity")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.rgpd.dataSecurityDesc")}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.rgpd.dataSharing")}</Typography>
                <Typography sx={{pt: 3}}>
                    {t("static.rgpd.dataSharingDesc")}
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>{t("static.rgpd.share1")}</li>
                    <li>{t("static.rgpd.share2")}</li>
                    <li>{t("static.rgpd.share3")}</li>
                </Box>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.rgpd.complaint")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.rgpd.complaintContent").split('\n').map((line, i, arr) => (
                        <span key={i}>
                            {i === arr.length - 1 ? (
                                <>
                                    {line}{' '}
                                    <Link href="https://www.cnil.fr" target="_blank" rel="noopener">www.cnil.fr</Link>
                                </>
                            ) : (
                                <>{line}<br /></>
                            )}
                        </span>
                    ))}
                </Typography>
            </>
        )
    },

    "cgu": {
        title: t("static.cgu.title"),
        lastUpdate: t("static.cgu.lastUpdate"),
        content: (
            <>
                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cgu.object")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.cgu.objectDesc")}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cgu.acceptance")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.cgu.acceptanceDesc")}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cgu.siteAccess")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.cgu.siteAccessDesc")}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cgu.services")}</Typography>
                <Typography sx={{pt: 3}}>
                    {t("static.cgu.servicesDesc")}
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>{t("static.cgu.service1")}</li>
                    <li>{t("static.cgu.service2")}</li>
                    <li>{t("static.cgu.service3")}</li>
                    <li>{t("static.cgu.service4")}</li>
                </Box>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cgu.usage")}</Typography>
                <Typography sx={{pt: 3}}>
                    {t("static.cgu.usageDesc")}
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>{t("static.cgu.usage1")}</li>
                    <li>{t("static.cgu.usage2")}</li>
                    <li>{t("static.cgu.usage3")}</li>
                    <li>{t("static.cgu.usage4")}</li>
                    <li>{t("static.cgu.usage5")}</li>
                    <li>{t("static.cgu.usage6")}</li>
                </Box>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cgu.intellectualProperty")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.cgu.intellectualPropertyDesc")}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cgu.liability")}</Typography>
                <Typography sx={{pt: 3}}>
                    {t("static.cgu.liabilityDesc")}
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>{t("static.cgu.liability1")}</li>
                    <li>{t("static.cgu.liability2")}</li>
                    <li>{t("static.cgu.liability3")}</li>
                    <li>{t("static.cgu.liability4")}</li>
                    <li>{t("static.cgu.liability5")}</li>
                </Box>

                <Typography sx={{pb: 3}}>
                    {t("static.cgu.liabilityNote")}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cgu.ticketAvailability")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.cgu.ticketAvailabilityDesc")}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cgu.modification")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.cgu.modificationDesc")}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cgu.applicableLaw")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.cgu.applicableLawDesc")}
                </Typography>
            </>
        )
    },

    "cgv": {
        title: t("static.cgv.title"),
        lastUpdate: t("static.cgv.lastUpdate"),
        content: (
            <>
                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cgv.object")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.cgv.objectDesc")}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cgv.tickets")}</Typography>
                <Typography sx={{pt: 3}}>
                    {t("static.cgv.ticketsDesc")}
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li><strong>{t("static.cgv.ticket1")}</strong></li>
                    <li><strong>{t("static.cgv.ticket2")}</strong></li>
                    <li><strong>{t("static.cgv.ticket3")}</strong></li>
                    <li><strong>{t("static.cgv.ticket4")}</strong></li>
                    <li><strong>{t("static.cgv.ticket5")}</strong></li>
                </Box>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cgv.prices")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.cgv.pricesDesc")}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cgv.booking")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.cgv.bookingDesc")}
                </Typography>

                <Typography variant="h5" pt={2}>{t("static.cgv.bookingProcess")}</Typography>
                <Box component="ol" sx={{pt: 3, pb: 3}}>
                    <li>{t("static.cgv.process1")}</li>
                    <li>{t("static.cgv.process2")}</li>
                    <li>{t("static.cgv.process3")}</li>
                    <li>{t("static.cgv.process4")}</li>
                    <li>{t("static.cgv.process5")}</li>
                    <li>{t("static.cgv.process6")}</li>
                    <li>{t("static.cgv.process7")}</li>
                </Box>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cgv.payment")}</Typography>
                <Typography sx={{pt: 3}}>
                    {t("static.cgv.paymentDesc")}
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>{t("static.cgv.paymentMethod1")}</li>
                    <li>{t("static.cgv.paymentMethod2")}</li>
                    <li>{t("static.cgv.paymentMethod3")}</li>
                </Box>
                <Typography sx={{pb: 3}}>
                    {t("static.cgv.paymentSecurity")}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cgv.eTickets")}</Typography>
                <Typography sx={{pt: 3}}>
                    {t("static.cgv.eTicketsDesc")}
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>{t("static.cgv.eTicket1")}</li>
                    <li>{t("static.cgv.eTicket2")}</li>
                    <li>{t("static.cgv.eTicket3")}</li>
                    <li>{t("static.cgv.eTicket4")}</li>
                </Box>
                <Typography sx={{pb: 3}}>
                    {t("static.cgv.eTicketNote")}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cgv.validity")}</Typography>
                <Typography sx={{pt: 3}}>
                    {t("static.cgv.validityDesc")}
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li><strong>{t("static.cgv.validity1")}</strong></li>
                    <li><strong>{t("static.cgv.validity2")}</strong></li>
                    <li><strong>{t("static.cgv.validity3")}</strong></li>
                </Box>
                <Typography sx={{pb: 3}}>
                    {t("static.cgv.validityNote")}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cgv.withdrawal")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.cgv.withdrawalDesc")}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cgv.modificationCancellation")}</Typography>

                <Typography variant="h5" pt={2}>{t("static.cgv.modificationByClient")}</Typography>
                <Typography sx={{pt: 3}}>
                    {t("static.cgv.modificationByClientDesc")}
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li><strong>{t("static.cgv.modify1")}</strong></li>
                    <li><strong>{t("static.cgv.modify2")}</strong></li>
                </Box>

                <Typography variant="h5">{t("static.cgv.cancellationByClient")}</Typography>
                <Typography sx={{pt: 3}}>
                    {t("static.cgv.cancellationByClientDesc")}
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li><strong>{t("static.cgv.cancel1")}</strong></li>
                    <li><strong>{t("static.cgv.cancel2")}</strong></li>
                    <li><strong>{t("static.cgv.cancel3")}</strong></li>
                </Box>

                <Typography variant="h5">{t("static.cgv.parkClosure")}</Typography>
                <Typography sx={{pt: 3}}>
                    {t("static.cgv.parkClosureDesc")}
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>{t("static.cgv.closure1")}</li>
                    <li>{t("static.cgv.closure2")}</li>
                    <li>{t("static.cgv.closure3")}</li>
                </Box>

                <Typography variant="h5">{t("static.cgv.partialClosure")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.cgv.partialClosureDesc")}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cgv.accessConditions")}</Typography>
                <Typography sx={{pt: 3}}>
                    {t("static.cgv.accessConditionsDesc")}
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>{t("static.cgv.access1")}</li>
                    <li>{t("static.cgv.access2")}</li>
                    <li>{t("static.cgv.access3")}</li>
                    <li>{t("static.cgv.access4")}</li>
                    <li>{t("static.cgv.access5")}</li>
                    <li>{t("static.cgv.access6")}</li>
                </Box>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cgv.security")}</Typography>
                <Typography sx={{pt: 3}}>
                    {t("static.cgv.securityDesc")}
                </Typography>
                <Box component="ul" sx={{pb: 3}}>
                    <li>{t("static.cgv.security1")}</li>
                    <li>{t("static.cgv.security2")}</li>
                    <li>{t("static.cgv.security3")}</li>
                    <li>{t("static.cgv.security4")}</li>
                </Box>
                <Typography sx={{pb: 3}}>
                    {t("static.cgv.securityNote")}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cgv.ageRestrictions")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.cgv.ageRestrictionsDesc")}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cgv.claims")}</Typography>
                <Typography sx={{pt: 3}}>
                    {t("static.cgv.claimsDesc")}
                </Typography>
                <Typography sx={{pb: 3}}>
                    {t("static.cgv.claimsContact").split('\n').map((line, i) => (
                        <span key={i}>{line}<br /></span>
                    ))}
                </Typography>
                <Typography sx={{pb: 3}}>
                    {t("static.cgv.claimsResponse")}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cgv.mediation")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.cgv.mediationContent").split('\n').map((line, i) => (
                        <span key={i}>
                            {i === 0 ? <strong>{line}</strong> : line}
                            <br />
                        </span>
                    ))}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cgv.personalData")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.cgv.personalDataDesc")}
                </Typography>

                <Typography variant="h3" color={colors.primaryGreen}>{t("static.cgv.applicableLaw")}</Typography>
                <Typography sx={{pt: 3, pb: 3}}>
                    {t("static.cgv.applicableLawDesc")}
                </Typography>
            </>
        )
    }
});
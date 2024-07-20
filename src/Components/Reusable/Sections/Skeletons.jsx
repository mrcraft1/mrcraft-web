import { AccessTime } from "@mui/icons-material";
import {
    Box,
    Card,
    CardContent,
    Divider,
    Grid,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Rating,
    Skeleton,
    Typography,
    useTheme,
} from "@mui/material";

//every page's skeleton come from here
export const SkeletonSwiperSlide = () => {
    return (
        <Box display={"flex"} justifyContent={"space-around"}>
            <Card className="swiper-skeleton-card">
                <Skeleton
                    variant="rectangular"
                    height={200}
                    className="border-radius-4"
                />
                <CardContent className="textaling-center mt-m7">
                    <Skeleton width="100%" height="30px" />
                </CardContent>
            </Card>
        </Box>
    );
};

export const PartnerSkeleton = () => {
    return (
        <div>
            <Box sx={{ width: { xs: 275, md: 370 }, borderRadius: "12px" }} className="partenr-skeleton">
                <Skeleton variant="rectangular" height={240} className="mb-2" />
                <Skeleton
                    variant="circular"
                    width={80}
                    height={80}
                    className="partner-skeleton-logo"
                />
                <Skeleton
                    variant="text"
                    height={30}
                    width={150}
                    className="partner-skeleton-text"
                />
                <Skeleton
                    variant="text"
                    height={30}
                    width={80}
                    className="partner-skeleton-text"
                />
                <Skeleton
                    variant="rectangular"
                    height={1}
                    width="70%"
                    className="mb-2 partner-skeleton-text"
                />
                <Skeleton
                    variant="text"
                    height={30}
                    width={200}
                    className="partner-skeleton-text mt-2"
                />
                <Skeleton
                    variant="rectangular"
                    height={1}
                    width="40%"
                    className="partner-skeleton-text mb-2"
                />
                <Skeleton
                    variant="rectangular"
                    height={30}
                    width={180}
                    className="partner-skeleton-text"
                />
            </Box>
        </div>
    );
};

export const SkeletonSubCategory = () => {
    return (
        <Box display={"flex"} justifyContent={"space-around"}>
            <Card className="subcat-skeleton">
                <Skeleton
                    variant="rectangular"
                    height={200}
                    className="border-radius-4"
                />
                <CardContent className="subcat-card-content">
                    <Skeleton width="100%" height="30px" />
                </CardContent>
            </Card>
        </Box>
    );
};

export const ProviderFlexSkeleton = () => {
    return (
        <Card className="provider-card-skeleton">
            <Skeleton height={160} width={160} variant="rectangular" />

            <Box display={"flex"} flexDirection={"column"} width={"100%"}>
                <Grid container alignItems="center" className="ml-1">
                    <Grid item xs>
                        <Typography gutterBottom={true} variant="h6" fontSize={18}>
                            <Skeleton animation="wave" width="60%" />
                        </Typography>
                    </Grid>
                </Grid>
                <Box display={"flex"}>
                    <Rating readOnly value={0} />
                    <Typography variant="p">
                        <Skeleton animation="wave" width={40} />
                    </Typography>
                </Box>
            </Box>
        </Card>
    );
};

export const BookingSkeleton = () => {
    const theme = useTheme();
    return (
        <Box
            border={`1px solid ${theme.palette.color.navLink}`}
            borderRadius={"10px"}
            width={"100%"}
            mb={3}
        >
            <Box
                display="flex"
                justifyContent="space-between"
                p={1}
                alignItems={"center"}
            >
                <Skeleton
                    variant="rectangular"
                    width={100}
                    height={100}
                    className="border-radius-1"
                />
                <Box display="block" flex={1} pl={1}>
                    <Skeleton height={30} width="60%" />
                    <Skeleton height={20} width="40%" />
                    <Skeleton height={20} width="30%" />
                </Box>
                <Skeleton height={40} width={80} />
            </Box>
            <Divider />

            <Box mt={1} ml={3} mr={3} pl={1}>
                <Box mt={2} mb={2}>
                    <Skeleton height={20} width="80%" />
                    <Skeleton height={20} width="80%" />
                    <Skeleton height={20} width="60%" />
                </Box>
            </Box>
            <Divider />

            <Box pl={2}>
                <ListItem>
                    <ListItemAvatar>
                        <AccessTime />
                    </ListItemAvatar>
                    <ListItemText
                        primary={<Skeleton height={20} width="50%" />}
                        secondary={<Skeleton height={20} width="30%" />}
                    />
                </ListItem>
            </Box>
        </Box>
    );
};

export const ServiceSkeleton = () => {
    return (
        <>
            <Skeleton variant="rectangular" height={200} width={620} />
        </>
    );
};

export const PromoSkeleton = () => {
    return (
        <>
            <Skeleton variant="rectangular" height={200} width={"100%"} sx={{ my: 2 }} />
            <Skeleton variant="rectangular" height={200} width={"100%"} sx={{ my: 2 }} />
            <Skeleton variant="rectangular" height={200} width={"100%"} sx={{ my: 2 }} />
        </>
    );
};

export const LineSkeleton = () => {
    return (
        <>
            <Skeleton variant="rectangular" height={100} sx={{ width: { xs: 250, md: 1150 } }} />
        </>
    );
};


export const CategorySkeleton = () => {
    return (<Box sx={{ display: 'inline-block', border: '1px solid #e0e0e0', padding: '16px' }}>
        <Skeleton variant="rectangular" width={200} height={200} />
        <Skeleton variant="text" width={200} />
    </Box>)
};

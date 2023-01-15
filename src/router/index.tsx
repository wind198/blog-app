import { Box } from "@chakra-ui/react";
import { Suspense, PropsWithChildren, lazy } from "react";
import { RouteObject, BrowserRouter, useRoutes } from "react-router-dom";
import LazyLoadedRouteFallback from "../components/lazy-loaded-route-fallback";
import LoginedAppLayout from "../layout/logged-in-app-layout";
import AddBlogPage from "../pages/add-blog";
const HomePage = lazy(() => import("../pages/home"));

const RouteWrapper = (props: PropsWithChildren<{}>) => {
  const { children } = props;

  return <>{children}</>;
};

const LazyRouteWrapper = (props: PropsWithChildren<{}>) => {
  return (
    <Suspense fallback={<LazyLoadedRouteFallback />}>{props.children}</Suspense>
  );
};

const routes: RouteObject[] = [
  {
    element: <LoginedAppLayout />,
    children: [
      {
        path: "",
        element: (
          <LazyRouteWrapper>
            <HomePage />
          </LazyRouteWrapper>
        ),
      },
      {
        path: "add-blog",
        element: (
          <LazyRouteWrapper>
            <AddBlogPage />
          </LazyRouteWrapper>
        ),
      },
    ],
  },
];

const AppRouteTree = (props: PropsWithChildren<{}>) => {
  const routeTree = useRoutes(routes);
  return (
    <Box w={"full"} h="full" className="route-tree">
      {routeTree}
    </Box>
  );
};

export default AppRouteTree;

'use client';
import { FigurinhasCard } from '@/components/admin/figurinhas';
import { NichosCard } from '@/components/admin/nichos';
import { SubnichosCard } from '@/components/admin/subnichos';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Overview } from '@/components/overview';
// import { RecentSales } from '@/components/recent-sales';
// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle
// } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useSocketStore from '@/store/useSocketStore';
import useUserStore from '@/store/useUserStore';
import { User } from 'lucide-react';
import { useEffect } from 'react';

const waveAnimation = {
  scale: [1, 1.3, 1.3, 1.3, 1],
  opacity: [1, 0.7, 0.7, 0.7, 1],
  transition: {
    duration: 3,
    repeat: Infinity,
    repeatDelay: 0,
    ease: 'easeInOut'
  }
};

export default function Page() {
  const connectToSocket = useSocketStore((state) => state.connectToSocket);
  const listenToEvent = useSocketStore((state) => state.listenToEvent);
  const setActiveUsers = useUserStore((state) => state.setActiveUsers);
  const activeUsers = useUserStore((state) => state.activeUsers);

  useEffect(() => {
    connectToSocket();

    listenToEvent('activeUsers', (count: number) => {
      setActiveUsers(count);
    });
  }, [connectToSocket, listenToEvent, setActiveUsers]);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Olá, Bem Vinda Novamente 👋
          </h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="flex items-center gap-2 space-x-2 text-sm font-medium">
                    <span>Total Online</span>
                    <div className="relative flex items-center justify-center">
                      <motion.div
                        className="absolute h-3 w-3 rounded-full bg-green-500"
                        animate={waveAnimation}
                      />
                    </div>
                  </CardTitle>
                  <User />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{activeUsers}</p>
                </CardContent>
              </Card>
              <NichosCard />
              <SubnichosCard />
              <FigurinhasCard />
            </div>
            {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div> */}
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}

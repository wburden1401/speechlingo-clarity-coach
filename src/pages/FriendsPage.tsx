import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Share, UserPlus, Flame, Award } from "lucide-react";
import { mockFriends, mockActivity } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function FriendsPage() {
  return (
    <div className="space-y-6 pt-6 pb-24">
      <div className="px-4 mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Friends</h1>
          <Button size="sm" variant="outline" className="gap-1">
            <UserPlus className="h-4 w-4" /> Add
          </Button>
        </div>
      </div>

      <Tabs defaultValue="friends" className="px-4">
        <TabsList className="w-full">
          <TabsTrigger value="friends" className="flex-1">
            Friends
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex-1">
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="mt-4 space-y-4">
          {mockFriends.map((friend) => (
            <Card key={friend.id} className="p-3 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={friend.avatar} alt={friend.name} />
                  <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{friend.name}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Award className="h-3 w-3 mr-1" />
                    <span>Level {friend.level}</span>
                    <span className="mx-1">•</span>
                    <Flame className="h-3 w-3 mr-1 text-lingo-orange" />
                    <span>{friend.streak} days</span>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                {friend.lastActive}
              </div>
            </Card>
          ))}
          
          <Card className="p-4 flex flex-col items-center gap-3">
            <p className="text-sm text-center">
              Invite friends to join you on your speaking journey!
            </p>
            <Button size="sm" className="gap-2 bg-lingo-blue hover:bg-lingo-blue/90">
              <Share className="h-4 w-4" />
              Invite Friends
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-4 space-y-4">
          {mockActivity.map((activity) => (
            <Card key={activity.id} className="p-3">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.userAvatar} alt={activity.userName} />
                  <AvatarFallback>{activity.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{activity.userName}</span>{" "}
                    {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FriendsPage;

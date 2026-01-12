import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, Users } from "lucide-react";

interface Artist {
  id: number;
  name: string;
  image: string;
  members: string[];
  creationDate: number;
  firstAlbum: string;
}

interface ArtistCardProps {
  artist: Artist;
  onFavorite?: (id: number) => void;
  isFavorite?: boolean;
}

export function ArtistCard({ artist, onFavorite, isFavorite = false }: ArtistCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={artist.image}
          alt={artist.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={() => onFavorite?.(artist.id)}
        >
          <Heart
            className={isFavorite ? "fill-red-500 text-red-500" : ""}
            size={20}
          />
        </Button>
      </div>

      <CardHeader>
        <CardTitle className="text-xl">{artist.name}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar size={16} />
          <span>Formé en {artist.creationDate}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users size={16} />
          <span>{artist.members.length} membres</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {artist.members.slice(0, 3).map((member, idx) => (
            <Badge key={idx} variant="secondary">
              {member}
            </Badge>
          ))}
          {artist.members.length > 3 && (
            <Badge variant="outline">+{artist.members.length - 3}</Badge>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full">Voir les concerts</Button>
      </CardFooter>
    </Card>
  );
}

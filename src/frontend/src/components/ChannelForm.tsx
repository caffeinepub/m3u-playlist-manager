import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Channel, ChannelInput } from "@/types/channel";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface ChannelFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channel?: Channel | null;
  groups: string[];
  onSubmit: (data: ChannelInput) => void;
  isPending?: boolean;
}

type FormValues = {
  name: string;
  group: string;
  url: string;
  logo: string;
  userAgent: string;
};

export function ChannelForm({
  open,
  onOpenChange,
  channel,
  groups,
  onSubmit,
  isPending,
}: ChannelFormProps) {
  const isEdit = !!channel;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      group: "",
      url: "",
      logo: "",
      userAgent: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        channel
          ? {
              name: channel.name,
              group: channel.group,
              url: channel.url,
              logo: channel.logo,
              userAgent: channel.userAgent,
            }
          : { name: "", group: "", url: "", logo: "", userAgent: "" },
      );
    }
  }, [open, channel, reset]);

  const handleFormSubmit = (values: FormValues) => {
    onSubmit({
      ...values,
      order: channel?.order ?? 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-card border-border max-w-lg"
        data-ocid="channel-form-modal"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">
            {isEdit ? "Edit Channel" : "Add Channel"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="cf-name" className="text-xs text-muted-foreground">
              Channel Name *
            </Label>
            <Input
              id="cf-name"
              data-ocid="channel-form-name"
              className="bg-background border-input text-foreground"
              placeholder="CNN HD"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <p className="text-xs text-destructive">Name is required</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cf-group" className="text-xs text-muted-foreground">
              Group
            </Label>
            <Input
              id="cf-group"
              data-ocid="channel-form-group"
              className="bg-background border-input text-foreground"
              placeholder="News"
              list="cf-group-list"
              {...register("group")}
            />
            <datalist id="cf-group-list">
              {groups.map((g) => (
                <option key={g} value={g} />
              ))}
            </datalist>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cf-url" className="text-xs text-muted-foreground">
              Stream URL *
            </Label>
            <Input
              id="cf-url"
              data-ocid="channel-form-url"
              className="bg-background border-input text-foreground font-mono text-sm"
              placeholder="https://example.com/stream.m3u8"
              {...register("url", { required: true })}
            />
            {errors.url && (
              <p className="text-xs text-destructive">URL is required</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cf-logo" className="text-xs text-muted-foreground">
              Logo URL
            </Label>
            <Input
              id="cf-logo"
              data-ocid="channel-form-logo"
              className="bg-background border-input text-foreground"
              placeholder="https://example.com/logo.png"
              {...register("logo")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cf-ua" className="text-xs text-muted-foreground">
              User-Agent
            </Label>
            <Input
              id="cf-ua"
              data-ocid="channel-form-useragent"
              className="bg-background border-input text-foreground font-mono text-sm"
              placeholder="Mozilla/5.0"
              {...register("userAgent")}
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              data-ocid="channel-form-cancel"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="channel-form-submit"
              disabled={isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isPending ? "Saving…" : isEdit ? "Save Changes" : "Add Channel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

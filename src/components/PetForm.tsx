
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Animal, PetType, PlanType } from "@/types";
import { canUseFeature } from "@/lib/plans";
import { toast } from "@/hooks/use-toast";
import { uploadPetImage } from "@/lib/supabase";

interface PetFormProps {
  onSubmit: (data: Partial<Animal>) => Promise<Animal | null>;
  animal?: Animal;
  userId: string;
  userPlan: PlanType;
  onCancel: () => void;
}

interface FormValues {
  name: string;
  type: PetType;
  age: number;
  children_count: number;
  notes: string;
  image: FileList | null;
}

const PetForm = ({ onSubmit, animal, userId, userPlan, onCancel }: PetFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!animal;
  const canUploadPhoto = canUseFeature(userPlan, "customPhoto");

  const form = useForm<FormValues>({
    defaultValues: {
      name: animal?.name || "",
      type: animal?.type || "dog",
      age: animal?.age || 0,
      children_count: animal?.children_count || 0,
      notes: animal?.notes || "",
      image: null,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      const petData: Partial<Animal> = {
        name: values.name,
        type: values.type,
        age: values.age,
        children_count: values.children_count,
        notes: values.notes,
        plan: userPlan,
      };

      if (isEditMode) {
        petData.id = animal.id;
      } else {
        petData.user_id = userId;
      }

      // Handle image upload if available and permitted
      if (values.image && values.image.length > 0 && canUploadPhoto) {
        const animalId = animal?.id || 'new';
        const imageUrl = await uploadPetImage(userId, animalId, values.image[0]);
        if (imageUrl) {
          petData.image_url = imageUrl;
        }
      }

      const result = await onSubmit(petData);
      
      if (result) {
        toast({
          title: isEditMode ? "Pet updated" : "Pet created",
          description: `${values.name} has been ${isEditMode ? "updated" : "added to your account"}.`,
        });
        return result;
      }
      
      return null;
    } catch (error) {
      console.error("Error submitting pet form:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? "update" : "create"} pet. Please try again.`,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "Pet name is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Pet's name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pet type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="dog">Dog</SelectItem>
                    <SelectItem value="cat">Cat</SelectItem>
                    <SelectItem value="bird">Bird</SelectItem>
                    <SelectItem value="rabbit">Rabbit</SelectItem>
                    <SelectItem value="fish">Fish</SelectItem>
                    <SelectItem value="reptile">Reptile</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age (years)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="children_count"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of children</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Any important information about your pet"
                  className="h-24"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Pet Photo</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  disabled={!canUploadPhoto}
                  onChange={(e) => onChange(e.target.files)}
                  {...fieldProps}
                />
              </FormControl>
              {!canUploadPhoto && (
                <FormDescription>
                  Upgrade to Comfort or VIP plan to upload custom photos.
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditMode ? "Update Pet" : "Add Pet"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PetForm;

"use client";

import { qytetet, qytetet2, qytetet3 } from "@/lib/qytetet";

import * as React from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useCart from "@/hooks/use-cart";
import sendForms from "@/actions/api";
import HiddenForm from "./hidden-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const FormContent = () => {
  const [shteti, setShteti] = useState();

  const phoneRegexInfo = () => {
    if (shteti === "shqipëri") {
      return "10";
    } else if (shteti === "maqedoni") {
      return "9";
    } else {
      return "9";
    }
  };

  const shtetet = [
    { label: "Kosovë", value: "kosovë" },
    { label: "Shqipëri", value: "shqipëri" },
    { label: "Maqedoni", value: "maqedoni" },
  ];

  const validationSchema = Yup.object({
    emri: Yup.string()
      .max(20, "Emri duhet të ketë 20 ose më pak karaktere")
      .min(
        3,
        "Emri duhet të jetë i saktë dhe duhet të ketë 3 ose më shumë karaktere"
      )
      .required("Emri juaj është i domosdoshëm."),
    mbiemri: Yup.string()
      .max(20, "Mbiemri duhet të ketë 20 ose më pak karaktere")
      .min(
        3,
        "Mbiemri duhet të jetë i saktë dhe duhet të ketë 3 ose më shumë karaktere"
      )
      .required("Mbiemri juaj është i domosdoshëm."),
    number: Yup.string()
      .min(phoneRegexInfo(), "Numri duhet të ketë të pakten 9-10 karaktere")
      .required("Numri duhet të zgjidhet"),
    adresa: Yup.string()
      .max(30, "Adresa duhet të ketë 30 ose më pak karaktere")
      .min(
        3,
        "Adresa duhet të jetë i saktë dhe duhet të ketë 3 ose më shumë karaktere"
      )
      .required("Adresa është e domosdoshme."),
    shteti: Yup.string().required("Shteti duhet të zgjedhet"),
    qyteti: Yup.string().required("Qyteti duhet të zgjedhet"),
    quantity: Yup.array().of(Yup.string()),
    type: Yup.array().of(Yup.string()),
    title: Yup.array().of(Yup.string()),
  });

  const cart = useCart((state) => state.cart);
  const cartSet = useCart();

  const form = useForm({
    defaultValues: {
      quantity: cart.map((item) => item.quantity),
      type: cart.map((item) => item.type),
      title: cart.map((item) => item.attributes.title),
    },
    resolver: yupResolver(validationSchema),
  });

  const router = useRouter();
  const uuid = crypto.randomUUID();

  const onSubmit = async (values) => {
    await sendForms(values);
    router.push(`/faleminderit/${uuid}`, undefined, { scroll: true });
    cartSet.removeAll();
  };

  const {
    register,
    formState: { errors },
    reset,
    formState,
  } = form;

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const [open2, setOpen2] = React.useState(false);

  return (
    <div className="w-full border border-gray-200 rounded-md py-6 px-6 mt-5 sm:mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className=" grid grid-cols-1 sm:grid-cols-2 gap-8">
            {cart.map((item) => (
              <HiddenForm
                key={item.id}
                data={item}
                register={register}
                form={form}
              />
            ))}

            <FormField
              control={form.control}
              name="emri"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emri*</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      {...register("emri")}
                      disabled={cart.length === 0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mbiemri"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mbiemri*</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      {...register("mbiemri")}
                      disabled={cart.length === 0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="shteti"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Shteti*</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between"
                          disabled={cart.length === 0}
                        >
                          {value
                            ? shtetet.find((shteti) => shteti.value === value)
                                ?.label
                            : "Zgjedh shtetin"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Zgjedh shtetin"
                            className="h-9"
                          />
                          <CommandEmpty>Nuk u gjet asnjë shtet</CommandEmpty>
                          <CommandGroup>
                            {shtetet.map((shteti) => (
                              <CommandItem
                                key={shteti.value}
                                onSelect={(currentValue) => {
                                  form.setValue("shteti", shteti.label);
                                  setValue(
                                    currentValue === value ? "" : currentValue
                                  );
                                  setOpen(false);
                                  setShteti(currentValue);
                                }}
                              >
                                {shteti.label}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    value === shteti.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="qyteti"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Qyteti*</FormLabel>

                    <Popover open={open2} onOpenChange={setOpen2}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open2}
                          className="w-full justify-between"
                          disabled={!shteti || cart.length === 0}
                        >
                          {field.value && shteti === "kosovë"
                            ? qytetet.find(
                                (qytetet) => qytetet.name === field.value
                              )?.name
                            : field.value && shteti === "shqipëri"
                            ? qytetet2.find(
                                (qytetet2) => qytetet2.name === field.value
                              )?.name
                            : field.value && shteti === "maqedoni"
                            ? qytetet3.find(
                                (qytetet3) => qytetet3.name === field.value
                              )?.name
                            : "Zgjedh qytetin"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] h-[200px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Zgjedh qytetin"
                            className="h-9"
                          />
                          <CommandEmpty>Nuk u gjet asnjë qytet</CommandEmpty>
                          <CommandGroup>
                            {shteti === "kosovë"
                              ? qytetet.map((qyteti) => (
                                  <CommandItem
                                    value={qyteti.name}
                                    key={qyteti.name}
                                    onSelect={() => {
                                      form.setValue("qyteti", qyteti.name);
                                      setOpen2(false);
                                    }}
                                  >
                                    {qyteti.name}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        qyteti.name === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))
                              : shteti === "shqipëri"
                              ? qytetet2.map((qyteti2) => (
                                  <CommandItem
                                    value={qyteti2.name}
                                    key={qyteti2.name}
                                    onSelect={() => {
                                      form.setValue("qyteti", qyteti2.name);
                                      setOpen2(false);
                                    }}
                                  >
                                    {qyteti2.name}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        qyteti2.name === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))
                              : shteti === "maqedoni" &&
                                qytetet3.map((qyteti3) => (
                                  <CommandItem
                                    value={qyteti3.name}
                                    key={qyteti3.name}
                                    onSelect={() => {
                                      form.setValue("qyteti", qyteti3.name);
                                      setOpen2(false);
                                    }}
                                  >
                                    {qyteti3.name}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        qyteti3.name === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numri i telefonit*</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      {...register("number")}
                      disabled={!shteti || cart.length === 0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adresa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresa*</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      {...register("adresa")}
                      disabled={!shteti || cart.length === 0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            disabled={cart.length === 0}
            className="w-full mt-10 sm:w-[20%]"
          >
            Blej tani
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default FormContent;

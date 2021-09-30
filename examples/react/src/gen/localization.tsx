/** File auto-generated by `@erosson/fluent-typesafe`. Do not edit! */
import React from "react";
import { Localized } from "@fluent/react";

export function HelloWorld(props: {
  children?: React.ReactNode;
  elems?: { [name: string]: JSX.Element };
  vars: { title: string };
}): JSX.Element {
  return (
    <Localized id="hello-world" elems={props.elems} vars={props.vars}>
      {props.children || null}
    </Localized>
  );
}

export function Lights(props: {
  children?: React.ReactNode;
  elems?: { [name: string]: JSX.Element };
  vars: { count: number };
}): JSX.Element {
  return (
    <Localized id="lights" elems={props.elems} vars={props.vars}>
      {props.children || null}
    </Localized>
  );
}

export function SubTitle(props: {
  children?: React.ReactNode;
  elems?: { [name: string]: JSX.Element };
}): JSX.Element {
  return (
    <Localized id="sub-title" elems={props.elems}>
      {props.children || null}
    </Localized>
  );
}

export function ClickMe(props: {
  children?: React.ReactNode;
  elems?: { [name: string]: JSX.Element };
}): JSX.Element {
  return (
    <Localized id="click-me" elems={props.elems}>
      {props.children || null}
    </Localized>
  );
}

export function AlertMsg(props: {
  children?: React.ReactNode;
  elems?: { [name: string]: JSX.Element };
}): JSX.Element {
  return (
    <Localized id="alert-msg" elems={props.elems}>
      {props.children || null}
    </Localized>
  );
}

export function SharedPhotos(props: {
  children?: React.ReactNode;
  elems?: { [name: string]: JSX.Element };
  vars: { userName: string; photoCount: number; userGender: string };
}): JSX.Element {
  return (
    <Localized id="shared-photos" elems={props.elems} vars={props.vars}>
      {props.children || null}
    </Localized>
  );
}
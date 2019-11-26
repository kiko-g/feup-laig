:- use_module(library(random)). % Load random library
:- use_module(library(system)). % Load system library
:- use_module(library(lists)).  % Load list library

% associate main.pl with all used files
:- consult('display.pl').       
:- consult('menus.pl').
:- consult('logic.pl').
:- consult('checkInput.pl').


fuse :-
    menu.
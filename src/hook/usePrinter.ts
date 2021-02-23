import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "module/index";
import {
    setCurrentPaperIndexAction,
    setPapersOptionsAction,
    setPapersContentsAction,
    toggleCheckItemAction,
    togglePrintAvailableAction,
    setSelectedPrinterAction,
    reorderPaperContentsAction,
    addPaperContentAction,
    removePaperContentAction,
    PrintRowContent,
} from "module/printer";

const usePrinter = () => {
    const currentPaperIndex = useSelector((state: RootState) => state.printer.currentPaperIndex);
    const papersOptions = useSelector((state: RootState) => state.printer.papersOptions);
    const selectedPrinter = useSelector((state: RootState) => state.printer.selectedPrinter);
    const papersContents = useSelector((state: RootState) => state.printer.papersContents);

    const dispatch = useDispatch();

    const setCurrentPaperIndex = useCallback(
        (currentPaperIndex) => dispatch(setCurrentPaperIndexAction(currentPaperIndex)),
        [dispatch]
    );
    const setPapersOptions = useCallback((papersOptions) => dispatch(setPapersOptionsAction(papersOptions)), [
        dispatch,
    ]);
    const setPapersContents = useCallback((papersContents) => dispatch(setPapersContentsAction(papersContents)), [
        dispatch,
    ]);
    const togglePrintAvailable = useCallback(
        (paperIndex: number, printAvailable: boolean) =>
            dispatch(togglePrintAvailableAction(paperIndex, printAvailable)),
        [dispatch]
    );
    const toggleCheckItem = useCallback((optionIndex, item) => dispatch(toggleCheckItemAction(optionIndex, item)), [
        dispatch,
    ]);
    const setSelectedPrinter = useCallback((selectedPrinter) => dispatch(setSelectedPrinterAction(selectedPrinter)), [
        dispatch,
    ]);
    const reorderPaperContents = useCallback(
        (paperIndex: number, srcIndex: number, destIndex: number) =>
            dispatch(reorderPaperContentsAction(paperIndex, srcIndex, destIndex)),
        [dispatch]
    );

    const addPaperContent = useCallback(
        (paperIndex: number, printRowContent: PrintRowContent) =>
            dispatch(addPaperContentAction(paperIndex, printRowContent)),
        [dispatch]
    );
    const removePaperContent = useCallback(
        (paperIndex: number, contentIndex: number) => dispatch(removePaperContentAction(paperIndex, contentIndex)),
        [dispatch]
    );

    return {
        currentPaperIndex,
        papersOptions,
        selectedPrinter,
        papersContents,
        setCurrentPaperIndex,
        setPapersOptions,
        setPapersContents,
        togglePrintAvailable,
        toggleCheckItem,
        setSelectedPrinter,
        reorderPaperContents,
        addPaperContent,
        removePaperContent,
    };
};

export default usePrinter;

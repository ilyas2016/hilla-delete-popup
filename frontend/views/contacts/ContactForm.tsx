import {TextField} from "@hilla/react-components/TextField";
import {EmailField} from "@hilla/react-components/EmailField";
import {Select, SelectItem} from "@hilla/react-components/Select";
import {Button} from "@hilla/react-components/Button";
import {useForm} from "@hilla/react-form";
import ContactRecordModel from "Frontend/generated/com/example/application/services/CRMService/ContactRecordModel";
import {CRMService} from "Frontend/generated/endpoints";
import {useEffect, useState} from "react";
import ContactRecord from "Frontend/generated/com/example/application/services/CRMService/ContactRecord";
import {ConfirmDialog} from "@hilla/react-components/ConfirmDialog";

interface ContactFormProps {
    contact?: ContactRecord | null;
    onSubmit?: (contact: ContactRecord) => Promise<void>;
    onRemove: (contact: ContactRecord) => Promise<void>;
}

export default function ContactForm({contact, onSubmit, onRemove}: ContactFormProps) {

    const [companies, setCompanies] = useState<SelectItem[]>([]);

    const {field, model, submit, reset, read} = useForm(ContactRecordModel, {onSubmit});
    const [dialogOpened, setDialogOpened] = useState<boolean>(false);

    useEffect(() => {
        read(contact);
    }, [contact]);

    useEffect(() => {
        getCompanies();
    }, []);

    async function getCompanies() {
        const companies = await CRMService.findAllCompanies();
        const companyItems = companies.map(company => {
            return {
                label: company.name,
                value: company.id + ""
            };
        });
        setCompanies(companyItems);
    }

    async function remove() {
        if (contact) {
            await onRemove(contact)
        }
        setDialogOpened(false);
    }

    return (
        <>
            <ConfirmDialog
                header='Delete Record'
                cancelButtonVisible
                confirmText="Delete"
                confirmTheme="error primary"
                opened={dialogOpened}
                onCancel={() => {
                    setDialogOpened(false)
                }}
                onConfirm={remove}
            >
                Are you sure you want to permanently delete this record?
            </ConfirmDialog>
            <div className="flex flex-col gap-s items-stretch p-m pt-0">
                <TextField label="First name" {...field(model.firstName)} />
                <TextField label="Last name" {...field(model.lastName)} />
                <EmailField label="Email" {...field(model.email)} />
                <Select label="Company" items={companies} {...field(model.company.id)} />

                <div className="flex gap-m">
                    <Button onClick={submit} theme="primary">Save</Button>
                    <Button onClick={reset}>Reset</Button>
                    <Button theme="error" onClick={() => setDialogOpened(true)}>Delete</Button>
                </div>
            </div>
        </>
    )
}
// export enum RuleConfigSeverity {
// 	Disabled = 0,
// 	Error = 2,
// 	Warning = 1,
// }
// export type CaseRuleConfig = RuleConfig<Array<TargetCaseType> | TargetCaseType>;

// export type EnumRuleConfig = RuleConfig<Array<string>>;
// export type LengthRuleConfig = RuleConfig<number>;

// export type PatternEnumRuleConfig = RuleConfig<string>;
// export type QualifiedRuleConfig<T> = (() => Promise<RuleConfigTuple<T>>) | (() => RuleConfigTuple<T>) | RuleConfigTuple<T>;

// export type RuleConfig<T = void> = QualifiedRuleConfig<T>;
// export type RuleConfigTuple<T> = T extends void ? Readonly<[RuleConfigSeverity.Disabled]> | Readonly<[RuleConfigSeverity]> : Readonly<[RuleConfigSeverity, T]> | Readonly<[RuleConfigSeverity.Disabled]>;

export interface IRulesList {
	// "branch-pattern": PatternEnumRuleConfig;
	// "branch-prohibited": EnumRuleConfig;

	// "scope-case": CaseRuleConfig;
	// "scope-empty": RuleConfig;
	// "scope-enum": EnumRuleConfig;
	// "scope-max-length": LengthRuleConfig;

	// "scope-min-length": LengthRuleConfig;
	// "subject-case": CaseRuleConfig;
	// "subject-empty": RuleConfig;
	// "subject-max-length": LengthRuleConfig;

	// "subject-min-length": LengthRuleConfig;
	// "type-case": CaseRuleConfig;
	// "type-empty": RuleConfig;
	// "type-enum": EnumRuleConfig;
	// "type-max-length": LengthRuleConfig;
	// "type-min-length": LengthRuleConfig;

	"branch-max-length": number;
	"branch-min-length": number;
	"branch-pattern": string;
	"branch-prohibited": Array<string>;
	"branch-subject-pattern": string;
}

// export type TargetCaseType = "camelCase" | "kebab-case" | "lowercase" | "UPPERCASE";
